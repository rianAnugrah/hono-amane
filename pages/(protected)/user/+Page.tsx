import { Link } from "@/renderer/Link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";
import { UserPlus, Filter, RefreshCw } from "lucide-react";
import UserFormModal from "./_shared/user-form-modal";
import Badge from "@/components/ui/badge";

// Extended User type with all needed properties
type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  placement?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  password: string;
  userLocations?: Array<{ id: number; description?: string }>;
  locations?: Array<{ id: number; description?: string }>;
  location?: { id: number; description?: string };
  locationIds?: number[];
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Partial<User>>({ email: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<"active" | "deleted">("active");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/users?${query}`);
      const data = await res.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      // No filters applied for deleted users - fetch all deleted users
      const res = await fetch(`/api/users/deleted`);
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Deleted users response data:", data);
      setDeletedUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching deleted users:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to refresh both lists
  const refreshBothLists = async () => {
    try {
      // Fetch both active and deleted users in parallel
      const [activeRes, deletedRes] = await Promise.all([
        fetch(`/api/users?${new URLSearchParams(filters).toString()}`),
        fetch(`/api/users/deleted`)
      ]);

      const [activeData, deletedData] = await Promise.all([
        activeRes.json(),
        deletedRes.json()
      ]);

      setUsers(activeData.data || []);
      setDeletedUsers(deletedData.data || []);
    } catch (error) {
      console.error("Error refreshing both lists:", error);
    }
  };

  useEffect(() => {
    if (currentView === "active") {
      fetchUsers();
    } else {
      fetchDeletedUsers();
    }
  }, [filters, currentView]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (currentView === "active") {
      fetchUsers();
    } else {
      fetchDeletedUsers();
    }
  };

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

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setForm({ email: "", password: "" });
      setEditingId(null);
      setIsModalOpen(false);
      
      // Always refresh both lists after create/update to keep counts accurate
      await refreshBothLists();
    } catch (error) {
      console.error("Error submitting user form:", error);
    }
  };

  const handleEdit = (user: User) => {
    const locsArray = user?.locations?.map((loc) => loc.id);
    setForm({ ...user, locationIds: locsArray });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        
        // After deletion, refresh both lists to update counts
        await refreshBothLists();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleRestore = async (id: string) => {
    if (window.confirm("Are you sure you want to restore this user?")) {
      try {
        await fetch(`/api/users/${id}/restore`, { method: "POST" });
        
        // After restoration, refresh both lists to update counts
        await refreshBothLists();
      } catch (error) {
        console.error("Error restoring user:", error);
      }
    }
  };

  const handleCancel = () => {
    setForm({ email: "", password: "" });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 min-h-screen">
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

      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage system users and their access permissions
            </p>
          </div>

          {currentView === "active" && (
            <motion.button
              onClick={() => {
                setForm({ email: "", password: "" });
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors w-full md:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        className="mb-6 flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.button
          onClick={() => setCurrentView("active")}
          className={`px-4 py-2  transition-colors ${
            currentView === "active"
              ? "border-b-2 border-blue-600 text-blue-600 font-bold"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Active Users ({users.length})
        </motion.button>
        <motion.button
          onClick={() => setCurrentView("deleted")}
          className={`px-4 py-2  transition-colors ${
            currentView === "deleted"
              ? "border-b-2 border-blue-600 text-blue-600 font-bold"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Deleted Users ({deletedUsers.length})
        </motion.button>
      </motion.div>

      {/* Filters Section - Only show for active users */}
      {currentView === "active" && (
        <motion.div
          className="mb-5 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-700 font-medium gap-2">
              <Filter className="w-4 h-4" />
              <span>Filter Options</span>
            </div>

            <motion.button
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </motion.button>
          </div>

          <UserFilterToolbar 
            key={currentView}
            onChange={setFilters} 
          />
        </motion.div>
      )}

      {/* Refresh Button for Deleted Users */}
      {currentView === "deleted" && (
        <motion.div
          className="mb-5 flex justify-end"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </motion.button>
        </motion.div>
      )}

      {/* User List */}
      <motion.div
        className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-6 border-b border-gray-200 px-6 py-3">
          <div className="text-sm font-medium text-gray-600">Email</div>
          <div className="text-sm font-medium text-gray-600">Name</div>
          <div className="text-sm font-medium text-gray-600">Role</div>
          <div className="text-sm font-medium text-gray-600">Placement</div>
          <div className="text-sm font-medium text-gray-600">
            {currentView === "deleted" ? "Deleted At" : "Created At"}
          </div>
          <div className="text-sm font-medium text-gray-600">Actions</div>
        </div>

        {/* Loading State */}
        {loading && !refreshing && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-500">Loading users...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && ((currentView === "active" && users.length === 0) || (currentView === "deleted" && deletedUsers.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {currentView === "active" ? "No users found" : "No deleted users found"}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {currentView === "active" 
                ? "There are no users matching your current filters. Try adjusting your search or create a new user."
                : "There are no deleted users matching your current filters. Try adjusting your search."
              }
            </p>
            {currentView === "active" && (
              <motion.button
                onClick={() => {
                  setForm({ email: "", password: "" });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First User</span>
              </motion.button>
            )}
          </div>
        )}

        {/* User List */}
        {!loading && ((currentView === "active" && users.length > 0) || (currentView === "deleted" && deletedUsers.length > 0)) && (
          <div className="divide-y divide-gray-100 overflow-y-auto max-h-[calc(100vh-320px)]">
            <AnimatePresence mode="popLayout">
              {(currentView === "active" ? users : deletedUsers).map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                  className="grid grid-cols-1 md:grid-cols-6 px-6 py-4 hover:bg-gray-50 transition-all gap-y-2 md:gap-y-0"
                  layout
                >
                  {/* Email */}
                  <div className="flex items-center">
                    <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                      Email:
                    </span>
                    {currentView === "active" ? (
                      <Link
                        href={`/user/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        {user.email}
                      </Link>
                    ) : (
                      <span className="text-gray-700 text-sm font-medium">
                        {user.email}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex items-center">
                    <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                      Name:
                    </span>
                    <span className="text-gray-800 text-sm font-medium">
                      {user.name || "—"}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="flex items-center">
                    <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                      Role:
                    </span>
                    <div className="text-gray-800">
                      {user.role ? (
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "manager"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "read_only"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </div>
                  </div>

                  {/* Placement */}
                  <div className="flex items-center">
                    <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                      Placement:
                    </span>
                    <span className="text-gray-700 text-sm flex flex-wrap gap-1">
                      {user?.locations?.map((loc) => <Badge key={loc.id} text={loc.description || ""} color="blue" variant="light" />)}
                    </span>
                  </div>

                  {/* Date Column */}
                  <div className="flex items-center">
                    <span className="md:hidden text-xs font-medium text-gray-500 w-20">
                      {currentView === "deleted" ? "Deleted:" : "Created:"}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {currentView === "deleted" && user.deletedAt
                        ? new Date(user.deletedAt).toLocaleDateString()
                        : new Date(user.createdAt).toLocaleDateString()
                      }
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 md:justify-start justify-end items-center">
                    {currentView === "active" ? (
                      <>
                        <motion.button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit user"
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
                              strokeWidth={1.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </motion.button>

                        <motion.button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete user"
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
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => handleRestore(user.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Restore user"
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
                            strokeWidth={1.5}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}