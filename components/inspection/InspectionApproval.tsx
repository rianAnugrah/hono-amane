import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import { useUserStore } from '@/stores/store-user-login';

interface InspectionApprovalProps {
  inspectionId: string;
  inspection: {
    id: string;
    status: string;
    lead_signature_data?: string | null;
    head_signature_data?: string | null;
    lead_signature_timestamp?: string | null;
    head_signature_timestamp?: string | null;
  };
  onApprovalChange?: () => void;
}

type ApprovalRole = 'lead' | 'head';

interface ApprovalStatus {
  lead: {
    signed: boolean;
    timestamp?: string;
    signatureData?: string;
  };
  head: {
    signed: boolean;
    timestamp?: string;
    signatureData?: string;
  };
}

const InspectionApproval: React.FC<InspectionApprovalProps> = ({
  inspectionId,
  inspection,
  onApprovalChange
}) => {
  const { role } = useUserStore();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentApprovalRole, setCurrentApprovalRole] = useState<ApprovalRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({
    lead: { signed: false },
    head: { signed: false }
  });

  // Update approval status when inspection data changes
  useEffect(() => {
    setApprovalStatus({
      lead: {
        signed: !!inspection.lead_signature_data,
        timestamp: inspection.lead_signature_timestamp || undefined,
        signatureData: inspection.lead_signature_data || undefined
      },
      head: {
        signed: !!inspection.head_signature_data,
        timestamp: inspection.head_signature_timestamp || undefined,
        signatureData: inspection.head_signature_data || undefined
      }
    });
  }, [inspection]);

  // Check if current user can perform approval actions
  const canApproveAsLead = role && ['admin', 'lead', 'supervisor'].includes(role.toLowerCase());
  const canApproveAsHead = role && ['admin', 'head', 'manager'].includes(role.toLowerCase());

  // Handle signature save
  const handleSignatureSave = async (signatureData: string) => {
    if (!currentApprovalRole) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/inspections/${inspectionId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: currentApprovalRole,
          signatureData: signatureData,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save signature');
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setApprovalStatus(prev => ({
          ...prev,
          [currentApprovalRole]: {
            signed: true,
            timestamp: new Date().toISOString(),
            signatureData: signatureData
          }
        }));

        // Close modal
        setShowSignatureModal(false);
        setCurrentApprovalRole(null);

        // Notify parent component
        if (onApprovalChange) {
          onApprovalChange();
        }
      } else {
        throw new Error(data.error || 'Failed to save signature');
      }
    } catch (err) {
      console.error('Error saving signature:', err);
      setError(err instanceof Error ? err.message : 'Failed to save signature');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle signature cancel
  const handleSignatureCancel = () => {
    setShowSignatureModal(false);
    setCurrentApprovalRole(null);
    setError(null);
  };

  // Start approval process
  const handleStartApproval = (role: ApprovalRole) => {
    if (approvalStatus[role].signed) return;
    
    setCurrentApprovalRole(role);
    setShowSignatureModal(true);
    setError(null);
  };

  // Remove signature (for testing/corrections)
  const handleRemoveSignature = async (role: ApprovalRole) => {
    if (!window.confirm(`Are you sure you want to remove the ${role} signature? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/inspections/${inspectionId}/approve`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove signature');
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setApprovalStatus(prev => ({
          ...prev,
          [role]: {
            signed: false,
            timestamp: undefined,
            signatureData: undefined
          }
        }));

        // Notify parent component
        if (onApprovalChange) {
          onApprovalChange();
        }
      } else {
        throw new Error(data.error || 'Failed to remove signature');
      }
    } catch (err) {
      console.error('Error removing signature:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove signature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSignatureTitle = () => {
    if (currentApprovalRole === 'lead') {
      return 'Lead Approval Signature';
    } else if (currentApprovalRole === 'head') {
      return 'Head Approval Signature';
    }
    return 'Digital Signature';
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Inspection Approval
        </h2>
        
        <div className="flex items-center space-x-2">
          {approvalStatus.lead.signed && approvalStatus.head.signed && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Fully Approved
            </span>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Lead Approval */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                approvalStatus.lead.signed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {approvalStatus.lead.signed ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Lead Approval</h3>
                {approvalStatus.lead.signed ? (
                  <p className="text-sm text-green-600">
                    Signed on {new Date(approvalStatus.lead.timestamp!).toLocaleDateString()} at {new Date(approvalStatus.lead.timestamp!).toLocaleTimeString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Signature required</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              {approvalStatus.lead.signed ? (
                <>
                  {canApproveAsLead && (
                    <motion.button
                      onClick={() => handleRemoveSignature('lead')}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Remove
                    </motion.button>
                  )}
                </>
              ) : (
                canApproveAsLead && (
                  <motion.button
                    onClick={() => handleStartApproval('lead')}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign as Lead
                  </motion.button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Head Approval */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                approvalStatus.head.signed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {approvalStatus.head.signed ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Head Approval</h3>
                {approvalStatus.head.signed ? (
                  <p className="text-sm text-green-600">
                    Signed on {new Date(approvalStatus.head.timestamp!).toLocaleDateString()} at {new Date(approvalStatus.head.timestamp!).toLocaleTimeString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Signature required</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              {approvalStatus.head.signed ? (
                <>
                  {canApproveAsHead && (
                    <motion.button
                      onClick={() => handleRemoveSignature('head')}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Remove
                    </motion.button>
                  )}
                </>
              ) : (
                canApproveAsHead && (
                  <motion.button
                    onClick={() => handleStartApproval('head')}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign as Head
                  </motion.button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {!canApproveAsLead && !canApproveAsHead && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-700">
              You don't have permission to approve inspections. Only users with Lead or Head roles can sign approvals.
            </p>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && (
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
                title={getSignatureTitle()}
                onSave={handleSignatureSave}
                onCancel={handleSignatureCancel}
                isLoading={isSubmitting}
                width={500}
                height={250}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InspectionApproval; 