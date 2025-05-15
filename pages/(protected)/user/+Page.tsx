import { Link } from "@/renderer/Link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";
import { PlusCircle, Menu, X } from "lucide-react";
import UserFormModal from "./_shared/user-form-modal";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

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

    const { email, name, role, placement, password, locationIds } = form;

    const body = {
      email,
      name,
      role,
      placement,
      locationIds,
      ...(editingId ? {} : { password }), // don't send password when editing
    };
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    

    setForm({ email: "", password: "" });
    setEditingId(null);
    setIsModalOpen(false);
    fetchUsers();
  };

  const handleEdit = (user: User) => {



    const locsArray = user?.locations?.map((loc) => loc.id)
    console.log("USER", user , locsArray)

    setForm({ ...user, locationIds: locsArray });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleCancel = () => {
    setForm({ email: "", password: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="">
      {/* Sidebar */}
      {/* <motion.div
        className="sticky top-0 h-screen bg-gray-100 flex-shrink-0 overflow-y-auto"
        initial={{ width: 256 }}
        animate={{ width: isSidebarOpen ? 256 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isSidebarOpen && (
          <div className="p-4">
            <UserFilterToolbar onChange={setFilters} />
          </div>
        )}
      </motion.div> */}

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto relative ">
        <div className="flex justify-between items-center gap-4 mb-4 ">
          <div className="flex items-center gap-4">
            {/* <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button> */}
            <h1 className="text-2xl font-bold">Users</h1>
          </div>
          {/* <button
            onClick={() => {
              setForm({ email: "", password: "" });
              setIsModalOpen(true);
            }}
            className="px-4 flex items-center gap-2 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
          >
            <PlusCircle />
            Add User
          </button> */}
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <UserFormModal
              form={form}
              setForm={setForm}
              editingId={editingId}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </AnimatePresence>

        <UserFilterToolbar onChange={setFilters} />

        <div className="bg-white shadow-xs rounded-lg overflow-hidden">
          <div className="hidden md:grid md:grid-cols-5 bg-gray-50 px-6 py-4">
            <div className="text-sm font-medium text-gray-500">Email</div>
            <div className="text-sm font-medium text-gray-500">Name</div>
            <div className="text-sm font-medium text-gray-500">Role</div>
            <div className="text-sm font-medium text-gray-500">Placement</div>
            <div className="text-sm font-medium text-gray-500">Actions</div>
          </div>
          
          <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(100vh_-_460px)]">
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
                    <span className="text-gray-800">
                      {user.location?.description || "-"}
                    </span>
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
    </div>
  );
}