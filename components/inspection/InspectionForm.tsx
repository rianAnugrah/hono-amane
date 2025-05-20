import { useState, useEffect } from 'react';
import { navigate } from 'vike/client/router';

type User = {
  id: string;
  name: string | null;
  email: string;
};

interface InspectionFormProps {
  onBack?: () => void;
  onSuccess?: (inspectionId: string) => void;
  isStandalone?: boolean;
}

const InspectionForm = ({ onBack, onSuccess, isStandalone = false }: InspectionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [inspectorId, setInspectorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  // Fetch users for inspector selection
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        const usersData = Array.isArray(data) ? data : data.data || [];
        setUsers(usersData);
        // If there's at least one user, select the first by default
        if (usersData.length > 0) {
          setInspectorId(usersData[0].id);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspector_id: inspectorId,
          date,
          notes: notes.trim() || null,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        
        // Notify parent component of success if callback provided
        if (onSuccess && data.data && data.data.id) {
          onSuccess(data.data.id);
        } 
        // Navigate to the inspection detail page in standalone mode
        else if (isStandalone) {
          setTimeout(() => {
            navigate(`/inspection/${data.data.id}`);
          }, 1000);
        }
      } else {
        setError(data.error || 'Failed to create inspection');
      }
    } catch (err) {
      console.error('Error creating inspection:', err);
      setError('Failed to create inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    } else if (isStandalone) {
      navigate('/inspection');
    }
  };
  
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Inspection</h1>
        <p className="text-gray-600 mt-1">Start a new inspection by filling out the form below</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Inspection created successfully! {isStandalone ? "Redirecting..." : ""}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="inspector" className="block text-sm font-medium text-gray-700 mb-1">
            Inspector
          </label>
          <select
            id="inspector"
            value={inspectorId}
            onChange={(e) => setInspectorId(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select an inspector</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Inspection Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            placeholder="Add any additional notes about this inspection..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Inspection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InspectionForm; 