import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import InputSelect from "@/components/ui/input-select";
import MultiSelect from "@/components/ui/multi-select";

type Location = {
  id: number;
  description: string;
};

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  placement?: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  locationIds?: number[]; // use this instead of `location` or `locationId`
  locations?: Array<{ id: number; description?: string }>;
  location?: { id: number; description?: string };
};

type UserFormProps = {
  form: Partial<User>;
  setForm: (form: Partial<User>) => void;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

// Utility function to get cookie value by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export default function UserFormModal({
  form,
  setForm,
  editingId,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [pmdUsers, setPmdUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchLocations = useCallback(async () => {
    const res = await axios.get("/api/locations");
    setLocations(res.data);
  }, []);

  const fetchPmdUsers = useCallback(async () => {
    if (!search.trim() || editingId) return;
    
    setIsSearching(true);
    try {
      const hcmlSessionCookie = getCookie('hcmlSession');
      const res = await axios.post("https://pmd.hcml.co.id/api/person/read_all", {
        select: {
          name: true,
          email: true,
        },
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }, {
        headers: {
          "Content-Type": "application/json",
          ...(hcmlSessionCookie && { "Cookie": `hcmlSession=${hcmlSessionCookie}` })
        },
        withCredentials: true
      });
      setPmdUsers(res.data.items || []);
      setShowUserDropdown(res.data.items?.length > 0);
    } catch (error) {
      console.error('Error fetching PMD users:', error);
      setPmdUsers([]);
      setShowUserDropdown(false);
    } finally {
      setIsSearching(false);
    }
  }, [search, editingId]);

  const handleUserSelect = (selectedUser: User) => {
    // Update form with selected user data
    setForm({
      ...form,
      name: selectedUser.name || "",
      email: selectedUser.email || "",
    });
    
    // Update search to show selected user name
    setSearch(selectedUser.name || "");
    
    // Hide dropdown and clear users list
    setShowUserDropdown(false);
    setPmdUsers([]);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, name: value });
    setSearch(value);
    
    if (!editingId) {
      setShowUserDropdown(false);
      // Clear email when name changes (unless editing)
      if (!value.trim()) {
        setForm({ ...form, name: value, email: "" });
      }
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim() && !editingId) {
        fetchPmdUsers();
      } else {
        setPmdUsers([]);
        setShowUserDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, editingId, fetchPmdUsers]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  console.log(pmdUsers);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-2xl"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            {editingId ? "Edit User" : "New User"}
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={editingId ? "Name" : "Search name or type to add new user"}
                  value={form.name || ""}
                  disabled={!!editingId}
                  onChange={handleNameChange}
                  onFocus={() => {
                    if (!editingId && search.trim() && pmdUsers.length > 0) {
                      setShowUserDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding dropdown to allow clicking on items
                    setTimeout(() => setShowUserDropdown(false), 200);
                  }}
                />
                
                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* User selection dropdown */}
                {showUserDropdown && pmdUsers.length > 0 && !editingId && (
                  <div className="absolute top-full  mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {pmdUsers.map((user, index) => (
                      <button
                        key={`${user.email}-${index}`}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {search.trim() && !isSearching && pmdUsers.length === 0 && !editingId && !form.email && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 px-4 py-3 text-gray-500 text-sm">
                    No users found. You can create a new user with this name.
                  </div>
                )}
              </div>

              <div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  value={form.email || ""}
                  disabled={!!editingId}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                {locations.length > 0 && (
                  <InputSelect
                    label="Role"
                    options={[
                      {
                        value: "read_only",
                        label: "Read only",
                      },
                      {
                        value: "admin",
                        label: "Admin",
                      },
                      {
                        value: "head",
                        label: "Head",
                      },
                      {
                        value: "lead",
                        label: "Leader",
                      },
                      {
                        value: "pic",
                        label: "PIC",
                      },
                    ]}
                    value={form.role || "read_only"}
                    onChange={(e) => {
                      const value = typeof e === "string" ? e : e.target.value;
                      setForm({ ...form, role: value });
                    }}
                  />
                )}
              </div>

              <div>
                {locations.length > 0 && (
                  <MultiSelect
                    label="Location"
                    options={locations.map((loc) => ({
                      label: loc.description,
                      value: loc.id,
                    }))}
                    values={form.locationIds || []}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        locationIds: e.map((val) => Number(val)),
                      })
                    }
                  />
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 text-blue-600 font-medium rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                {editingId ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
