import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Filter } from 'lucide-react';
import { apiService } from '../../services/api';

const AdminSocieties: React.FC = () => {
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSocieties();
  }, []);

  const loadSocieties = async () => {
    try {
      setLoading(true);
      const res = await apiService.societies.getAll({ size: 100 }); // Fetch first 100 for now
      setSocieties(res.data.content || []);
    } catch (error) {
      console.error("Error loading societies", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSocieties = societies.filter(s =>
      s.societyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Registered Societies</h2>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search societies..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
            <div>Loading...</div>
        ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg. Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredSocieties.map((society) => (
                    <tr key={society.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{society.societyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{society.registeredDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {society.status}
                    </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900"><Eye className="w-5 h-5" /></button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default AdminSocieties;