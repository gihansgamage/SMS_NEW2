import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Eye } from 'lucide-react';

const StudentServiceMonitoring: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Specifically fetch ALL pending applications for monitoring
    apiService.admin.getSSMonitoring()
        .then(res => setItems(res.data))
        .catch(err => console.error(err));
  }, []);

  return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Application Monitoring</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Read Only View</span>
        </div>
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">{item.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status.includes('PENDING') ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                    }`}>
                  {item.status}
                </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{item.societyName}</h3>
                  <p className="text-sm text-gray-600">Current Stage: {item.status.replace('PENDING_', '')}</p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  <div>Submitted: {new Date(item.submittedDate).toLocaleDateString()}</div>
                  <div>Applicant: {item.applicantName}</div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default StudentServiceMonitoring;