import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Plus, Trash2, ToggleLeft, ToggleRight, UserCheck, Shield } from 'lucide-react';
import { User } from '../../types';

// Hardcoded faculties for dropdown to match system
const FACULTIES = [
  'Engineering', 'Science', 'Arts', 'Medicine', 'Agriculture',
  'Dental', 'Management', 'Allied Health', 'Veterinary'
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'DEAN', faculty: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiService.admin.getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch admin users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.admin.addUser(formData);
      setShowForm(false);
      setFormData({ name: '', email: '', role: 'DEAN', faculty: '' });
      fetchUsers(); // Refresh list
    } catch (err) {
      alert('Failed to add user. Ensure email is unique.');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await apiService.admin.toggleUserActive(id);
      fetchUsers(); // Refresh to show new state
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">System Access Management</h2>
              <p className="text-sm text-gray-500">Manage authorized administrators and their roles</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-maroon-800 hover:bg-maroon-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" /> <span>Grant Access</span>
          </button>
        </div>

        {/* Add User Form */}
        {showForm && (
            <div className="mb-8 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm animate-fade-in-down">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Register New Admin</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input placeholder="Ex: Prof. John Doe" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                    <input type="email" placeholder="dean.eng@pdn.ac.lk" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">System Role</label>
                    <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="DEAN">Dean</option>
                      <option value="ASSISTANT_REGISTRAR">Assistant Registrar</option>
                      <option value="VICE_CHANCELLOR">Vice Chancellor</option>
                      <option value="PREMISES_OFFICER">Premises Officer</option>
                      <option value="STUDENT_SERVICE">Student Service Division</option>
                    </select>
                  </div>
                  {formData.role === 'DEAN' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                        <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" value={formData.faculty} onChange={e => setFormData({...formData, faculty: e.target.value})} required>
                          <option value="">Select Faculty...</option>
                          {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">Save User</button>
                </div>
              </form>
            </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Faculty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading authorized users...</td></tr>
            ) : users.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No admin users found.</td></tr>
            ) : (
                users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mb-1">
                            {user.role.replace('_', ' ')}
                        </span>
                        {user.faculty && <div className="text-xs text-gray-500 mt-1">{user.faculty}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                            onClick={() => handleToggle(user.id)}
                            className={`p-1 rounded transition-colors ${user.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                            title={user.isActive ? "Deactivate User" : "Activate User"}
                        >
                          {user.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                        </button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default AdminUsers;