import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SignatureCanvas from '@/components/ui/SignatureCanvas';

export default function TestSignaturePage() {
  const [showSignature, setShowSignature] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  const handleSignatureSave = (signatureData: string) => {
    setSavedSignature(signatureData);
    setShowSignature(false);
  };

  const handleSignatureCancel = () => {
    setShowSignature(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Signature Canvas Test
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Digital Signature Component</h2>
          
          <p className="text-gray-600 mb-6">
            This page demonstrates the signature canvas component that can be used for digital signatures.
            The component supports both mouse and touch input for drawing signatures.
          </p>

          <div className="flex gap-4 mb-6">
            <motion.button
              onClick={() => setShowSignature(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Open Signature Canvas
            </motion.button>

            {savedSignature && (
              <motion.button
                onClick={() => setSavedSignature(null)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear Saved Signature
              </motion.button>
            )}
          </div>

          {savedSignature && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h3 className="text-lg font-medium mb-3">Saved Signature:</h3>
              <div className="bg-white border border-gray-300 rounded-lg p-4 inline-block">
                <img 
                  src={savedSignature} 
                  alt="Saved signature" 
                  className="max-w-md h-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Signature saved as base64 image data: {savedSignature.substring(0, 50)}...
              </p>
            </motion.div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Features:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-2">
            <li>Responsive canvas that adapts to container size</li>
            <li>Support for both mouse and touch input</li>
            <li>Clear and save functionality</li>
            <li>Base64 image data output for easy storage</li>
            <li>Modern UI with smooth animations</li>
            <li>Accessible design with proper focus states</li>
          </ul>
        </div>
      </motion.div>

      {/* Signature Modal */}
      {showSignature && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSignatureCancel();
            }
          }}
        >
          <div className="w-full max-w-lg">
            <SignatureCanvas
              title="Test Signature"
              onSave={handleSignatureSave}
              onCancel={handleSignatureCancel}
              width={500}
              height={250}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
} 