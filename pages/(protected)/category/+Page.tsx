import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ProjectCode = {
  id: number;
  code: string;
};

export default function ProjectCodesPage() {
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const fetchProjectCodes = async () => {
    const res = await axios.get('/api/project-codes', {
      params: { search, sortBy, order },
    });
    setProjectCodes(res.data);
  };

  useEffect(() => {
    fetchProjectCodes();
  }, [search, sortBy, order]);

  const handleCreate = async () => {
    if (!newCode.trim()) return;
    await axios.post('/api/project-codes', { code: newCode });
    setNewCode('');
    fetchProjectCodes();
  };

  const handleUpdate = async (id: number) => {
    if (!editCode.trim()) return;
    await axios.put(`/api/project-codes/${id}`, { code: editCode });
    setEditId(null);
    setEditCode('');
    fetchProjectCodes();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/project-codes/${id}`);
    fetchProjectCodes();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Codes</h1>

      {/* Create */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          placeholder="New code"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-2 mb-6 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search code..."
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="id">Sort by ID</option>
          <option value="code">Sort by Code</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
          className="border px-2 py-2 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {projectCodes.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-6 py-4 hover:bg-gray-50 transition-all duration-200 gap-y-2 md:gap-y-0"
          >
            {editId === project.id ? (
              <>
                <input
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  className="border px-2 py-1 rounded mr-2 w-full"
                />
                <div className="flex gap-2 justify-end ">
                  <button
                    onClick={() => handleUpdate(project.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditCode('');
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-lg">{project.code}</span>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditId(project.id);
                      setEditCode(project.code);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
