import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCodeForm from '../../../components/ProjectCodeForm';
import ProjectCodeList from '../../../components/ProjectCodeList';

export default function ProjectCodesPage() {
  const [refresh, setRefresh] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleCodeAdded = () => {
    setRefresh(true);
    if (isMobile) {
      setShowForm(false);
    }
  };

  const handleRefreshComplete = () => {
    setRefresh(false);
  };

  // Mobile view toggle between list and form
  if (isMobile) {
    return (
      <div className="p-4 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Codes</h1>
          <p className="text-gray-500 mb-4">Manage your project codes</p>
          
          <div className="flex gap-2 mb-4">
            <motion.button
              onClick={() => setShowForm(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition shadow-sm ${
                !showForm 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Project Codes
            </motion.button>
            
            <motion.button
              onClick={() => setShowForm(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition shadow-sm ${
                showForm 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Project Code
            </motion.button>
          </div>
        </div>
        
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectCodeForm onCodeAdded={handleCodeAdded} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectCodeList refresh={refresh} onRefreshComplete={handleRefreshComplete} />
          </motion.div>
        )}
      </div>
    );
  }

  // Desktop split view
  return (
    <div className="p-6 min-h-screen">
      <div className="mb-8 mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Codes</h1>
        <p className="text-gray-500">Manage your project codes</p>
      </div>
      
      <div className="grid grid-cols-12 gap-6 mx-auto ">
        {/* Form section */}
        <motion.div 
          className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Project Code</h2>
          <ProjectCodeForm onCodeAdded={handleCodeAdded} />
        </motion.div>
        
        {/* List section */}
        <motion.div 
          className="col-span-12 md:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Project Code List</h2>
          <ProjectCodeList refresh={refresh} onRefreshComplete={handleRefreshComplete} />
        </motion.div>
      </div>
    </div>
  );
}
