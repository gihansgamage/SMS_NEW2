import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Eye, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { apiService } from '../../services/api';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Calls the new /api/events/admin/all endpoint
      const res = await apiService.events.getAll();
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(e => filterStatus === 'all' || e.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending_dean: "bg-purple-100 text-purple-800 border-purple-200",
      pending_ar: "bg-orange-100 text-orange-800 border-orange-200",
      pending_vc: "bg-blue-100 text-blue-800 border-blue-200",
    };
    // @ts-ignore
    const style = styles[status] || "bg-gray-100 text-gray-800";
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${style}`}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Event Registry</h2>
            <p className="text-sm text-gray-500">Monitor and approve society events</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400"/>
            <select
                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-maroon-500 focus:border-maroon-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending_dean">Pending Dean</option>
              <option value="pending_ar">Pending AR</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Event Details</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Society</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Logistics</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading events...</td></tr>
            ) : filteredEvents.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No events found.</td></tr>
            ) : (
                filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{event.eventName}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1"/> {event.eventDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{event.societyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.place} <br/>
                        <span className="text-xs text-gray-400">{event.timeFrom} - {event.timeTo}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(event.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
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

export default AdminEvents;