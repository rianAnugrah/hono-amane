import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ProjectCode = {
  id: number;
  code: string;
};

interface ProjectCodeListProps {
  refresh: boolean;
  onRefreshComplete: () => void;
}

export default function ProjectCodeList({ refresh, onRefreshComplete }: ProjectCodeListProps) {
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editError, setEditError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjectCodes = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/project-codes', {
        params: { search, sortBy, order },
      });
      setProjectCodes(res.data);
    } catch (err) {
      console.error('Failed to fetch project codes:', err);
    } finally {
      setIsLoading(false);
      if (refresh) {
        onRefreshComplete();
      }
    }
  };

  useEffect(() => {
    fetchProjectCodes();
  }, [search, sortBy, order, refresh]);

  const handleUpdate = async (id: number) => {
    // Validation
    if (!editCode.trim()) {
      setEditError('Project code cannot be empty');
      return;
    }
    
    if (editCode.length > 30) {
      setEditError('Project code must be less than 30 characters');
      return;
    }
    
    try {
      await axios.put(`/api/project-codes/${id}`, { code: editCode });
      setEditId(null);
      setEditCode('');
      setEditError('');
      fetchProjectCodes();
    } catch (err) {
      setEditError('Failed to update project code');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project code?')) {
      try {
        await axios.delete(`/api/project-codes/${id}`);
        fetchProjectCodes();
      } catch (err) {
        console.error('Failed to delete project code:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Project Codes</h2>
      
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search project codes..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="id">Sort by ID</option>
            <option value="code">Sort by Code</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projectCodes.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No project codes found
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {projectCodes.map((project) => (
          <div
            key={project.id}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {editId === project.id ? (
              <div className="space-y-3">
                <input
                  value={editCode}
                  onChange={(e) => {
                    setEditCode(e.target.value);
                    setEditError('');
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editError && <p className="text-sm text-red-500">{editError}</p>}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleUpdate(project.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditCode('');
                      setEditError('');
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">{project.code}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(project.id);
                      setEditCode(project.code);
                      setEditError('');
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 