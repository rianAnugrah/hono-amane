import { useState, useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { motion } from 'framer-motion';

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Location = {
  id: number;
  description: string;
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [inspectorId, setInspectorId] = useState('');
  const [leadUserId, setLeadUserId] = useState('');
  const [headUserId, setHeadUserId] = useState('');
  const [locationDescId, setLocationDescId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');
  
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

  // Fetch locations
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => {
        const locationsData = Array.isArray(data) ? data : data.data || [];
        setLocations(locationsData);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations. Please try again.');
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
          lead_user_id: leadUserId || null,
          head_user_id: headUserId || null,
          locationDesc_id: locationDescId,
          date,
          notes: notes.trim() || null,
          status,
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
    <motion.div 
      className="p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create New Inspection</h1>
        <p className="text-gray-600">Start a new inspection by filling out the form below</p>
      </div>
      
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 shadow-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Inspection created successfully! {isStandalone ? "Redirecting..." : ""}</span>
          </div>
        </motion.div>
      )}
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mb-5">
          <label htmlFor="inspector" className="block text-sm font-medium text-gray-700 mb-1">
            Inspector
          </label>
          <div className="relative">
            <select
              id="inspector"
              value={inspectorId}
              onChange={(e) => setInspectorId(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
              required
            >
              <option value="">Select an inspector</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <select
              id="location"
              value={locationDescId || ''}
              onChange={(e) => setLocationDescId(e.target.value ? Number(e.target.value) : null)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
            >
              <option value="">Select a location (Optional)</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.description}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Select the location for this inspection</p>
        </div>
        
        <div className="mb-5">
          <label htmlFor="leadUser" className="block text-sm font-medium text-gray-700 mb-1">
            Lead Approver (Optional)
          </label>
          <div className="relative">
            <select
              id="leadUser"
              value={leadUserId}
              onChange={(e) => setLeadUserId(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
            >
              <option value="">Select Lead Approver (Optional)</option>
              {users
                .filter(user => user.id !== inspectorId && user.id !== headUserId)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">User who will provide lead-level approval for this inspection</p>
        </div>

        <div className="mb-5">
          <label htmlFor="headUser" className="block text-sm font-medium text-gray-700 mb-1">
            Head Approver (Optional)
          </label>
          <div className="relative">
            <select
              id="headUser"
              value={headUserId}
              onChange={(e) => setHeadUserId(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
            >
              <option value="">Select Head Approver (Optional)</option>
              {users
                .filter(user => user.id !== inspectorId && user.id !== leadUserId)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">User who will provide head-level approval for this inspection</p>
        </div>

        <div className="mb-5">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Inspection Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-5">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors bg-white"
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] transition-colors"
            placeholder="Add any additional notes about this inspection..."
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <motion.button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading || success}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:bg-blue-300 shadow-sm"
            whileHover={!loading && !success ? { scale: 1.02 } : {}}
            whileTap={!loading && !success ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Inspection
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default InspectionForm; 