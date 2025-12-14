import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, UserCheck, School } from 'lucide-react';
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
      // AuthContext will handle the state update, useEffect will redirect
    } catch (err: any) {
      console.error("Login Error:", err);
      // Improved error message display from Backend
      const msg = err.response?.data || 'Login failed. Check your credentials.';
      setFormError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-maroon-800 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              University Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Secure System Access
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">

              {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm text-center">
                    <strong className="font-bold">Access Denied: </strong>
                    <span className="block sm:inline">{formError}</span>
                  </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Official Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="focus:ring-maroon-500 focus:border-maroon-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                      placeholder="Enter your official email"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Administrative Role
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                      name="role"
                      id="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="focus:ring-maroon-500 focus:border-maroon-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                  >
                    <option value="">Select Role</option>
                    <option value="VICE_CHANCELLOR">Vice Chancellor</option>
                    <option value="DEAN">Dean</option>
                    <option value="ASSISTANT_REGISTRAR">Assistant Registrar</option>
                    <option value="STUDENT_SERVICE">Student Service Division</option>
                    <option value="PREMISES_OFFICER">Premises Officer</option>
                  </select>
                </div>
              </div>

              {/* Faculty Selection */}
              {formData.role === 'DEAN' && (
                  <div className="animate-fade-in-down">
                    <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                      Faculty
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <School className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                          name="faculty"
                          id="faculty"
                          required
                          value={formData.faculty}
                          onChange={handleInputChange}
                          className="focus:ring-maroon-500 focus:border-maroon-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                      >
                        <option value="">Select Faculty</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Dental">Dental Sciences</option>
                        <option value="Management">Management</option>
                        <option value="Allied Health">Allied Health Sciences</option>
                        <option value="Veterinary">Veterinary Medicine</option>
                      </select>
                    </div>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-maroon-800 hover:bg-maroon-900 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Access System'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default AdminLoginPage;