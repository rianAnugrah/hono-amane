import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/button';
import InputText from './ui/input-text';
import { Code } from 'lucide-react';

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
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-medium mb-4 text-gray-800">Add New Project Code</h2>
      <div className="flex flex-col gap-4">
        <InputText
          value={newCode}
          onChange={(e) => {
            setNewCode(e.target.value);
            setError('');
          }}
          placeholder="Project code"
          icon={<Code size={16} />}
          error={error}
          name="newCode"
        />
        
        <Button
          onClick={handleCreate}
          disabled={isSubmitting}
          variant="primary"
          fullWidth
          size="lg"
        >
          {isSubmitting ? 'Adding...' : 'Add Project Code'}
        </Button>
      </div>
    </div>
  );
} 