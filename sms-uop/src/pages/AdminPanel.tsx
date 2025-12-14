import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Users, Calendar, Mail, FileText,
  Shield, Eye, LogOut, Menu, X, School
} from 'lucide-react';
import { apiService } from '../services/api';

// Components
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminApprovals from '../components/Admin/AdminApprovals';
import AdminSocieties from '../components/Admin/AdminSocieties';
import AdminEvents from '../components/Admin/AdminEvents';
import AdminCommunication from '../components/Admin/AdminCommunication';
import AdminLogs from '../components/Admin/AdminLogs';
import AdminUsers from '../components/Admin/AdminUsers';
import StudentServiceMonitoring from '../components/Admin/StudentServiceMonitoring';

interface AdminUser {
  name: string;
  email: string;
  role: string;
  faculty?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only attempt to load if we have a session.
    apiService.admin.getCurrentUser()
        .then(res => setAdminUser(res.data))
        .catch(() => navigate('/admin/login')); // Redirect if 401
  }, [navigate]);

  const handleLogout = () => {
    apiService.auth.logout()
        .then(() => {
          // Force reload to clear all states
          window.location.href = '/';
        })
        .catch(() => window.location.href = '/');
  };

  if (!adminUser) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Authenticating Secure Session...</p>
        </div>
      </div>
  );

  const getTabs = () => {
    const role = adminUser.role.toUpperCase();
    const baseTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (role !== 'STUDENT_SERVICE') {
      baseTabs.push({ id: 'approvals', label: 'Approvals', icon: CheckSquare });
    }

    baseTabs.push(
        { id: 'societies', label: 'Societies', icon: Users },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'communication', label: 'Communication', icon: Mail },
        { id: 'logs', label: 'Logs', icon: FileText }
    );

    if (role === 'STUDENT_SERVICE') {
      baseTabs.push({ id: 'monitoring', label: 'Monitoring', icon: Eye });
    }

    if (role === 'ASSISTANT_REGISTRAR') {
      baseTabs.push({ id: 'users', label: 'Admin Users', icon: Shield });
    }

    return baseTabs;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard user={adminUser} />;
      case 'approvals': return <AdminApprovals user={adminUser} />;
      case 'societies': return <AdminSocieties />;
      case 'events': return <AdminEvents />;
      case 'communication': return <AdminCommunication />;
      case 'logs': return <AdminLogs />;
      case 'users': return <AdminUsers />;
      case 'monitoring': return <StudentServiceMonitoring />;
      default: return <AdminDashboard user={adminUser} />;
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        {/* Header - Maroon Background */}
        <header className="bg-[#500000] text-white shadow-lg sticky top-0 z-50 border-b-4 border-[#FFD700]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              <div className="flex items-center">
                <div className="bg-white p-1.5 rounded-full mr-3 shadow-md">
                  <School className="w-6 h-6 text-[#500000]" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-wide uppercase leading-none">University of Peradeniya</h1>
                  <p className="text-[10px] text-[#FFD700] tracking-wider uppercase font-semibold mt-1">Admin Portal</p>
                </div>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex space-x-1 ml-8 overflow-x-auto">
                {getTabs().map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-4 ${
                            activeTab === tab.id
                                ? 'bg-[#700000] border-[#FFD700] text-white shadow-inner'
                                : 'border-transparent text-gray-300 hover:text-white hover:bg-[#600000]'
                        }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                ))}
              </nav>

              <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-[#700000]">
                <div className="mr-4 text-right">
                  <p className="text-sm font-semibold text-white">{adminUser.name}</p>
                  <span className="text-[10px] bg-[#FFD700] text-[#500000] px-2 py-0.5 rounded-full font-bold uppercase">
                      {adminUser.role.replace('_', ' ')}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-[#700000] text-gray-300 hover:text-white transition-colors border border-transparent hover:border-red-400"
                    title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#600000]"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
              <div className="lg:hidden bg-[#400000] border-t border-[#600000]">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {getTabs().map(tab => (
                      <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-3 py-3 rounded-md text-base font-medium ${
                              activeTab === tab.id
                                  ? 'bg-[#600000] text-white border-l-4 border-[#FFD700]'
                                  : 'text-gray-300 hover:bg-[#500000] hover:text-white'
                          }`}
                      >
                        <tab.icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                  ))}
                  <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-red-200 hover:bg-[#500000]"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
          )}
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-xl rounded-lg border border-gray-200 min-h-[600px] animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
  );
};

export default AdminPanel;