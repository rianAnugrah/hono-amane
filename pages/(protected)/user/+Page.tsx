// pages/users/+Page.tsx
import { Link } from "@/renderer/Link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/components/blocks/user-filter-toolbar";

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  placement?: string;
  createdAt: string;
  updatedAt: string;
  password: string;
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User>>({ email: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/users?${query}`);
    const data = await res.json();
    setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/users/${editingId}` : "/api/users";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ email: "", password: "" });
    setEditingId(null);
    setIsModalOpen(false);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setForm(user);
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <AnimatePresence>
        {isModalOpen && (
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-center mb-6">
                  {editingId ? "Edit User" : "New User"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <input
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <input
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required={!editingId}
                      />
                    </div>

                    <div>
                      <input
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Name"
                        value={form.name || ""}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <input
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Role"
                        value={form.role || ""}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <input
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Placement"
                        value={form.placement || ""}
                        onChange={(e) =>
                          setForm({ ...form, placement: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ email: "", password: "" });
                        setEditingId(null);
                        setIsModalOpen(false);
                      }}
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
        )}
      </AnimatePresence>

      <div className="sticky top-4 z-10 flex justify-start mb-6">
        <UserFilterToolbar onChange={setFilters}>
          <button
            onClick={() => {
              setForm({ email: "", password: "" });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-all duration-150 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add User
          </button>
        </UserFilterToolbar>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header - Hide on mobile, show labels inline instead */}
        <div className="hidden md:grid md:grid-cols-5 bg-gray-50 px-6 py-4">
          <div className="text-sm font-medium text-gray-500">Email</div>
          <div className="text-sm font-medium text-gray-500">Name</div>
          <div className="text-sm font-medium text-gray-500">Role</div>
          <div className="text-sm font-medium text-gray-500">Placement</div>
          <div className="text-sm font-medium text-gray-500">Actions</div>
        </div>
        <div className="divide-y divide-gray-100">
          <AnimatePresence mode="popLayout">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-5 px-4 md:px-6 py-4 hover:bg-gray-50 transition-all duration-200 gap-y-2 md:gap-y-0"
              >
                <div className="flex items-center">
                  <span className="md:hidden text-sm font-medium text-gray-500 w-20">
                    Email:
                  </span>
                  <Link
                    href={`/user/${user.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                  >
                    {user.email}
                  </Link>
                </div>
                <div className="flex items-center">
                  <span className="md:hidden text-sm font-medium text-gray-500 w-20">
                    Name:
                  </span>
                  <span className="text-gray-800 font-medium">
                    {user.name || "-"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="md:hidden text-sm font-medium text-gray-500 w-20">
                    Role:
                  </span>
                  <div className="text-gray-800">
                    {user.role && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    )}
                    {!user.role && "-"}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="md:hidden text-sm font-medium text-gray-500 w-20">
                    Placement:
                  </span>
                  <span className="text-gray-800">{user.placement || "-"}</span>
                </div>
                <div className="flex space-x-2 md:justify-start justify-end">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-150"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
