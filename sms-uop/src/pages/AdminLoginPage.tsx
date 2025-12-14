import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, UserCheck, School, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    role: '',
    faculty: ''
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formData.email || !formData.role) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (formData.role === 'DEAN' && !formData.faculty) {
      setFormError('Faculty is required for Dean login.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.role, formData.faculty);
      // If success, useEffect will redirect
    } catch (err: any) {
      console.error("Login Error Object:", err);

      let errorMessage = 'Login failed. Server not responding.';

      if (err.response) {
        // Backend returned a response code (401, 404, 500)
        console.log("Error Response Data:", err.response.data);

        if (err.response.data && err.response.data.message) {
          // Capture the specific message from AuthController
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else {
          errorMessage = 'Access Denied. Please verify your credentials.';
        }
      }

      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Roles and Faculties arrays same as before) ...
  const roles = [
    { value: 'VICE_CHANCELLOR', label: 'Vice Chancellor' },
    { value: 'DEAN', label: 'Dean' },
    { value: 'ASSISTANT_REGISTRAR', label: 'Assistant Registrar' },
    { value: 'STUDENT_SERVICE', label: 'Student Service Division' },
    { value: 'PREMISES_OFFICER', label: 'Premises Officer' }
  ];

  const faculties = [
    'Engineering', 'Science', 'Arts', 'Medicine', 'Agriculture',
    'Dental', 'Management', 'Allied Health', 'Veterinary'
  ];

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#800000] rounded-full flex items-center justify-center shadow-lg border-2 border-[#FFD700]">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              University Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Restricted System Access
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">

              {formError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{formError}</p>
                    </div>
                  </div>
              )}

              {/* Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Official Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5"
                      placeholder="admin@pdn.ac.lk"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 bg-white"
                  >
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {formData.role === 'DEAN' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700">Faculty</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                          name="faculty"
                          required
                          value={formData.faculty}
                          onChange={handleInputChange}
                          className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 bg-white"
                      >
                        <option value="">Select Faculty</option>
                        {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Access System'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default AdminLoginPage;