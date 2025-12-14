import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Check, X, FileText } from 'lucide-react';

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
      fetchPending();
    } catch (err) {
      alert('Action failed. Please try again.');
    }
  };

  if (loading) return <div>Loading approvals...</div>;

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No pending approvals found for your review.</div>
          ) : (
              items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="p-6 flex items-center justify-between">
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
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* View Details Button logic would go here */}
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Application">
                        <FileText className="w-5 h-5" />
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
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default AdminApprovals;