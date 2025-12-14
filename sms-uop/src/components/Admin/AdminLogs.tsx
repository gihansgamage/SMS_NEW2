import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiService.admin.getActivityLogs({ page: 0, size: 50 });
      setLogs(res.data.content || []);
    } catch (error) {
      console.error("Fetch logs failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">System Audit Trail</h2>
          <button onClick={fetchLogs} className="flex items-center text-sm text-gray-600 hover:text-maroon-800">
            <RefreshCw className="w-4 h-4 mr-2"/> Refresh
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
              <div className="text-center py-10 text-gray-500">Loading logs...</div>
          ) : logs.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                <p className="text-gray-500">No activity recorded yet.</p>
              </div>
          ) : (
              logs.map((log) => (
                  <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-maroon-800 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600">
                        by <span className="font-medium">{log.userName}</span> ({log.userRole})
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default AdminLogs;