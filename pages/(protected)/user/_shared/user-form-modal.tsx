import { Link } from "@/renderer/Link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserFilterToolbar } from "@/pages/(protected)/user/_shared/user-filter-toolbar";
import { PlusCircle } from "lucide-react";

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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl"
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Role"
                  value={form.role || ""}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
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