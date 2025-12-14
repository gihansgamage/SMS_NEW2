import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Check, X, FileText, Eye, XCircle, AlertTriangle } from 'lucide-react';

interface PendingItem {
  id: string;
  type: 'registration' | 'renewal' | 'event';
  societyName: string;
  applicantName: string;
  submittedDate: string;
  status: string;
  details?: any; // Extra details like event name or faculty
}

const AdminApprovals: React.FC<{ user: any }> = ({ user }) => {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);

  const fetchPending = async () => {
    try {
      const res = await apiService.admin.getPendingApprovals();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, type: string, action: 'approve' | 'reject') => {
    const comment = action === 'reject' ? prompt('Enter rejection reason:') : prompt('Enter optional comment (or press OK to skip):');
    if (action === 'reject' && !comment) return;

    try {
      if (type === 'registration') {
        action === 'approve'
            ? await apiService.admin.approveRegistration(id, { comment: comment || undefined })
            : await apiService.admin.rejectRegistration(id, { comment: comment || '' });
      } else if (type === 'renewal') {
        action === 'approve'
            ? await apiService.admin.approveRenewal(id, { comment: comment || undefined })
            : await apiService.admin.rejectRenewal(id, { comment: comment || '' });
      } else if (type === 'event') {
        action === 'approve'
            ? await apiService.admin.approveEvent(id, { comment: comment || undefined })
            : await apiService.admin.rejectEvent(id, { comment: comment || '' });
      }

      alert(`Successfully ${action}ed!`);
      setSelectedItem(null); // Close modal
      fetchPending(); // Refresh list
    } catch (err: any) {
      // Show Backend Error Message if available
      const backendMsg = err.response?.data?.message || err.response?.data || 'Unknown error occurred.';
      alert(`Action Failed: ${backendMsg}`);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pending approvals...</div>;

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{items.length} Pending</span>
        </div>
        <div className="divide-y divide-gray-200">
          {items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Check className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No pending approvals found for your review.</p>
              </div>
          ) : (
              items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
                            item.type === 'registration' ? 'bg-blue-100 text-blue-800' :
                                item.type === 'renewal' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-500">{new Date(item.submittedDate).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{item.societyName}</h3>
                      <p className="text-sm text-gray-600">Applicant: {item.applicantName}</p>
                      {item.details && item.details.eventName && (
                          <p className="text-xs text-indigo-600 mt-1 font-medium">Event: {item.details.eventName}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                          onClick={() => setSelectedItem(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Full Application"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                          onClick={() => handleAction(item.id, item.type, 'reject')}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <button
                          onClick={() => handleAction(item.id, item.type, 'approve')}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                          title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
              ))
          )}
        </div>

        {/* View Application Modal */}
        {selectedItem && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedItem.societyName}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">{selectedItem.type} Application</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-red-500">
                    <XCircle className="w-8 h-8" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">Applicant</h4>
                      <p className="text-gray-600 mb-1"><span className="font-medium text-gray-900">Name:</span> {selectedItem.applicantName}</p>
                      <p className="text-gray-600 mb-1"><span className="font-medium text-gray-900">Date:</span> {new Date(selectedItem.submittedDate).toLocaleDateString()}</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-900">Status:</span> {selectedItem.status}</p>
                    </div>

                    {selectedItem.details && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Request Details</h4>
                          {Object.entries(selectedItem.details).map(([key, value]) => (
                              value && (
                                  <p key={key} className="text-blue-900 mb-1 truncate">
                                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}
                                  </p>
                              )
                          ))}
                        </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                  <button
                      onClick={() => handleAction(selectedItem.id, selectedItem.type, 'reject')}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
                  >
                    Reject
                  </button>
                  <button
                      onClick={() => handleAction(selectedItem.id, selectedItem.type, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm flex items-center"
                  >
                    <Check className="w-4 h-4 mr-2" /> Approve Request
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AdminApprovals;