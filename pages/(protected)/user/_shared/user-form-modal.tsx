import { Link } from "@/renderer/Link";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";
import { PlusCircle } from "lucide-react";
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

export default function UserFormModal({
  form,
  setForm,
  editingId,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchLocations = async () => {
    const res = await axios.get("/api/locations", {
      params: { search, sort: sortOrder },
    });
    setLocations(res.data);
  };

  useEffect(() => {
    fetchLocations();
  }, [search, sortOrder]);

  ////console.log("FORNM", locations);
  // Function to display object as formatted JSON
  // const formatObject = (obj) => {
  //   return JSON.stringify(obj, null, 2);
  // };

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
              <div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                        value: "pic",
                        label: "PIC",
                      }
                    ]}
                    value={form.role || "read_only"}
                    onChange={(e) => {
                      const value = typeof e === 'string' ? e : e.target.value;
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
