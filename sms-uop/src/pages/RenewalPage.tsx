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
  const { societies, loading: contextLoading, addActivityLog } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSocietyName, setSelectedSocietyName] = useState('');

  // Initial Form State
  const [formData, setFormData] = useState<Partial<SocietyRenewal>>({
    // Applicant details (Manual Entry Only)
    applicantFullName: '',
    applicantRegNo: '',
    applicantEmail: '',
    applicantFaculty: '',
    applicantMobile: '',

    // Society Details
    societyName: '',
    seniorTreasurer: { title: '', name: '', designation: '', department: '', email: '', address: '', mobile: '' },
    advisoryBoard: [{ name: '', designation: '', department: '' }],
    bankAccount: '',
    bankName: '',

    // Officials
    president: { regNo: '', name: '', address: '', email: '', mobile: '' },
    vicePresident: { regNo: '', name: '', address: '', email: '', mobile: '' },
    juniorTreasurer: { regNo: '', name: '', address: '', email: '', mobile: '' },
    secretary: { regNo: '', name: '', address: '', email: '', mobile: '' },
    jointSecretary: { regNo: '', name: '', address: '', email: '', mobile: '' },
    editor: { regNo: '', name: '', address: '', email: '', mobile: '' },

    committeeMember: [{ regNo: '', name: '' }],
    agmDate: '',
    member: [{ regNo: '', name: '' }],
    planningEvents: [{ month: '', activity: '' }],
    previousActivities: [{ month: '', activity: '' }],
    difficulties: '',
    website: ''
  });

  if (contextLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 text-[#800000] animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading Society Database...</p>
        </div>
    );
  }

  // Filter for ACTIVE societies
  const activeSocieties = (societies || [])
      .filter(s => s.status && s.status.toLowerCase() === 'active')
      .sort((a, b) => a.societyName.localeCompare(b.societyName));

  const handleSocietySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const societyName = e.target.value;
    setSelectedSocietyName(societyName);

    if (!societyName) {
      setFormData(prev => ({ ...prev, societyName: '' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.societies.getLatestData(societyName);
      const data = response.data; // This is the flat DB object

      // Manual Mapping: Flat DB fields -> Nested Form State
      setFormData(prev => ({
        ...prev,
        societyName: data.societyName,
        website: data.website || '',
        bankAccount: data.bankAccount || '',
        bankName: data.bankName || '',
        aims: data.aims || prev.aims,

        // Map Officials (Note: Address/Mobile might be missing in basic DB entity, user can fill/edit)
        president: {
          name: data.presidentName || '',
          regNo: data.presidentRegNo || '',
          email: data.presidentEmail || '',
          mobile: data.presidentMobile || '',
          address: '', // Manual fill if missing
        },
        vicePresident: {
          name: data.vicePresidentName || '',
          regNo: data.vicePresidentRegNo || '',
          email: data.vicePresidentEmail || '',
          mobile: data.vicePresidentMobile || '',
          address: '',
        },
        secretary: {
          name: data.secretaryName || '',
          regNo: data.secretaryRegNo || '',
          email: data.secretaryEmail || '',
          mobile: data.secretaryMobile || '',
          address: '',
        },
        jointSecretary: {
          name: data.jointSecretaryName || '',
          regNo: data.jointSecretaryRegNo || '',
          email: data.jointSecretaryEmail || '',
          mobile: data.jointSecretaryMobile || '',
          address: '',
        },
        juniorTreasurer: {
          name: data.treasurerName || '', // DB uses treasurerName
          regNo: data.treasurerRegNo || '',
          email: data.treasurerEmail || '',
          mobile: data.treasurerMobile || '',
          address: '',
        },
        editor: {
          name: data.editorName || '',
          regNo: data.editorRegNo || '',
          email: data.editorEmail || '',
          mobile: data.editorMobile || '',
          address: '',
        },
        seniorTreasurer: {
          name: data.seniorTreasurerName || '',
          email: data.seniorTreasurerEmail || '',
          title: '', // Manual fill
          designation: '', // Manual fill
          department: '', // Manual fill
          address: '', // Manual fill
          mobile: '', // Manual fill
        },

        // Ensure Applicant fields are NOT overwritten
        applicantFullName: prev.applicantFullName,
        applicantRegNo: prev.applicantRegNo,
        applicantEmail: prev.applicantEmail,
        applicantFaculty: prev.applicantFaculty,
        applicantMobile: prev.applicantMobile,
      }));

    } catch (error) {
      console.error('Failed to load society data:', error);
      alert('Could not fetch previous data. Please fill the form manually.');
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
      alert('Failed to submit renewal. Please check all fields.');
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-[#800000] transition-shadow bg-white"
                    disabled={isLoading}
                >
                  <option value="">-- Select an Active Society --</option>
                  {activeSocieties.map(society => (
                      <option key={society.id} value={society.societyName}>
                        {society.societyName}
                      </option>
                  ))}
                </select>

                {activeSocieties.length === 0 && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-md border-l-4 border-amber-500 flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-800">No Active Societies Found</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Only currently active societies can apply for renewal.
                          If your society is not listed, please contact the administration.
                        </p>
                      </div>
                    </div>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                    onClick={nextStep}
                    disabled={!selectedSocietyName || isLoading}
                    className="bg-[#800000] text-white px-8 py-3 rounded-lg hover:bg-[#600000] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
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
                <p className="text-gray-600">
                  Data from the previous year has been fetched. You can update any changed details.
                </p>
              </div>
              <StepIndicator steps={steps} currentStep={currentStep} />
              <div className="mt-8">{renderStep()}</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RenewalPage;