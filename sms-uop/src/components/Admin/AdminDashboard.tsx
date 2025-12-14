import React, { useEffect, useState } from 'react';
import { Users, FileText, Calendar, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface DashboardStats {
  totalSocieties: number;
  activeSocieties: number;
  pendingActions: number;
}

const AdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({ totalSocieties: 0, activeSocieties: 0, pendingActions: 0 });

  useEffect(() => {
    apiService.admin.getDashboard()
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
  }, []);

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
            <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalSocieties}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Societies</h3>
            <p className="text-sm text-gray-400 mt-1">{stats.activeSocieties} Active this year</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg"><AlertCircle className="w-6 h-6 text-orange-600" /></div>
              <span className="text-2xl font-bold text-gray-900">{stats.pendingActions}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Pending Actions</h3>
            <p className="text-sm text-gray-400 mt-1">Requires your attention</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg"><Calendar className="w-6 h-6 text-purple-600" /></div>
              <span className="text-2xl font-bold text-gray-900">{new Date().getFullYear()}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Academic Year</h3>
            <p className="text-sm text-gray-400 mt-1">Current Session</p>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;