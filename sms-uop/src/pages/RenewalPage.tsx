import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { SocietyRenewal } from '../types';
import StepIndicator from '../components/Common/StepIndicator';
import ApplicantInfoStep from '../components/Registration/steps/ApplicantInfoStep';
import SocietyInfoStep from '../components/Registration/steps/SocietyInfoStep';
import OfficialsStep from '../components/Registration/steps/OfficialsStep';
import MembersStep from '../components/Registration/steps/MembersStep';
import ReviewStep from '../components/Registration/steps/ReviewStep';
import { apiService } from '../services/api';
import { School, Loader2, AlertCircle } from 'lucide-react';

const steps = [
  { title: 'Select Society', description: 'Choose society to renew' },
  { title: 'Applicant', description: 'Personal information' },
  { title: 'Society', description: 'Basic details' },
  { title: 'Officials', description: 'Committee members' },
  { title: 'Members', description: 'Society members' },
  { title: 'Review', description: 'Final review' }
];

const RenewalPage: React.FC = () => {
  const navigate = useNavigate();
  const { societies, loading: contextLoading, error: contextError, addActivityLog } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSocietyName, setSelectedSocietyName] = useState('');

  // Initial Form State
  const [formData, setFormData] = useState<Partial<SocietyRenewal>>({
    applicantFullName: '', applicantRegNo: '', applicantEmail: '', applicantFaculty: '', applicantMobile: '',
    societyName: '',
    seniorTreasurer: { title: '', name: '', designation: '', department: '', email: '', address: '', mobile: '' },
    advisoryBoard: [{ name: '', designation: '', department: '' }],
    bankAccount: '', bankName: '',
    president: { regNo: '', name: '', address: '', email: '', mobile: '' },
    vicePresident: { regNo: '', name: '', address: '', email: '', mobile: '' },
    juniorTreasurer: { regNo: '', name: '', address: '', email: '', mobile: '' },
    secretary: { regNo: '', name: '', address: '', email: '', mobile: '' },
    jointSecretary: { regNo: '', name: '', address: '', email: '', mobile: '' },
    editor: { regNo: '', name: '', address: '', email: '', mobile: '' },
    committeeMember: [{ regNo: '', name: '' }],
    agmDate: '', member: [{ regNo: '', name: '' }],
    planningEvents: [{ month: '', activity: '' }],
    previousActivities: [{ month: '', activity: '' }],
    difficulties: '', website: ''
  });

  // 1. Loading State
  if (contextLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 text-[#800000] animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Application Data...</p>
        </div>
    );
  }

  // 2. Safe Data Access & Case-Insensitive Filter
  const activeSocieties = (societies || []).filter(s =>
      s.status && s.status.toLowerCase() === 'active'
  );

  const handleSocietySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const societyName = e.target.value;
    setSelectedSocietyName(societyName);

    if (!societyName) return;

    setIsLoading(true);
    try {
      const response = await apiService.societies.getLatestData(societyName);
      const society = response.data;

      setFormData(prev => ({
        ...prev,
        societyName: society.societyName,
        seniorTreasurer: society.seniorTreasurer || prev.seniorTreasurer,
        president: society.president || prev.president,
        vicePresident: society.vicePresident || prev.vicePresident,
        secretary: society.secretary || prev.secretary,
        jointSecretary: society.jointSecretary || prev.jointSecretary,
        juniorTreasurer: society.juniorTreasurer || prev.juniorTreasurer,
        editor: society.editor || prev.editor,
        website: society.website || ''
      }));
    } catch (error) {
      console.error('Failed to load society data:', error);
      alert('Could not auto-load society details. You can proceed by entering them manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: Partial<SocietyRenewal>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    Object.keys(updates).forEach(key => {
      if (errors[key]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await apiService.renewals.submit(formData);
      addActivityLog('Renewal Submitted', formData.societyName || 'Unknown', 'user', formData.applicantFullName || 'Unknown');
      alert(`Renewal application submitted successfully!`);
      navigate('/');
    } catch (error) {
      console.error('Failed to submit renewal:', error);
      alert('Failed to submit renewal. Please check all required fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <School className="w-6 h-6 mr-2 text-[#800000]" />
                Select Society to Renew
              </h2>
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registered Society Name <span className="text-red-500">*</span>
                </label>
                <select
                    value={selectedSocietyName}
                    onChange={handleSocietySelect}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] transition-shadow"
                    disabled={isLoading}
                >
                  <option value="">-- Select Society --</option>
                  {activeSocieties.map(society => (
                      <option key={society.id} value={society.societyName}>
                        {society.societyName}
                      </option>
                  ))}
                </select>
                {activeSocieties.length === 0 && (
                    <div className="mt-3 flex items-start p-3 bg-amber-50 rounded-md border border-amber-200">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        No active societies found. Please ensure your society is registered and currently active in the system.
                      </p>
                    </div>
                )}
              </div>
              <div className="flex justify-end mt-8">
                <button
                    onClick={nextStep}
                    disabled={!selectedSocietyName || isLoading}
                    className="bg-[#800000] text-white px-8 py-3 rounded-lg hover:bg-[#600000] transition-all shadow-md disabled:opacity-50 flex items-center"
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Loading Data...</> : 'Next Step'}
                </button>
              </div>
            </div>
        );
      case 1: return <ApplicantInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2: return <SocietyInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} isRenewal={true} activeSocieties={activeSocieties} errors={errors} />;
      case 3: return <OfficialsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4: return <MembersStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} isRenewal={true} />;
      case 5: return <ReviewStep formData={formData} onSubmit={handleSubmit} onPrev={prevStep} isRenewal={true} />;
      default: return null;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-12 font-sans">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-[#800000]">
            <div className="p-8">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Annual Society Renewal</h1>
                <p className="text-gray-600">Submit your society's annual renewal application for the upcoming academic year.</p>
              </div>

              <StepIndicator steps={steps} currentStep={currentStep} />

              <div className="mt-8">
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RenewalPage;