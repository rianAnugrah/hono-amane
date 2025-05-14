import React, { useState } from 'react';
import axios from 'axios';

interface ProjectCodeFormProps {
  onCodeAdded: () => void;
}

export default function ProjectCodeForm({ onCodeAdded }: ProjectCodeFormProps) {
  const [newCode, setNewCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    // Validation
    if (!newCode.trim()) {
      setError('Project code cannot be empty');
      return;
    }
    
    if (newCode.length > 30) {
      setError('Project code must be less than 30 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      await axios.post('/api/project-codes', { code: newCode });
      setNewCode('');
      onCodeAdded();
    } catch (err) {
      setError('Failed to add project code. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Add New Project Code</h2>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            value={newCode}
            onChange={(e) => {
              setNewCode(e.target.value);
              setError('');
            }}
            placeholder="Enter project code"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="bg-blue-500 text-white font-medium px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Project Code'}
        </button>
      </div>
    </div>
  );
} 