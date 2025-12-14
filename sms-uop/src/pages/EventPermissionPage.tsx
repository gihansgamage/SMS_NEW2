import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import StepIndicator from '../components/Common/StepIndicator';
import FormField from '../components/Common/FormField';
import ReviewStep from '../components/Registration/steps/ReviewStep';
import { apiService } from '../services/api';
import { FACULTIES } from '../types';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';

const steps = [
  { title: 'Applicant', description: 'Personal details' },
  { title: 'Event', description: 'Main event info' },
  { title: 'Logistics', description: 'Venue & Participants' },
  { title: 'Finance', description: 'Budget & Funding' },
  { title: 'Review', description: 'Final check' }
];

const EventPermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { societies, loading: contextLoading, addActivityLog } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Initial Form State
  const [formData, setFormData] = useState({
    societyName: '', applicantName: '', applicantRegNo: '', applicantEmail: '',
    applicantFaculty: '', applicantPosition: '', applicantMobile: '',
    eventName: '', eventDate: '', timeFrom: '', timeTo: '',
    place: '', isInsideUniversity: false, latePassRequired: false,
    outsidersInvited: false, outsidersList: '', firstYearParticipation: false,
    budgetEstimate: '', fundCollectionMethods: '', studentFeeAmount: '',
    seniorTreasurerName: '', seniorTreasurerDepartment: '', seniorTreasurerMobile: '',
    premisesOfficerName: '', premisesOfficerDesignation: '', premisesOfficerDivision: '',
    receiptNumber: '', paymentDate: ''
  });

  // 1. Fix Blank Page
  if (contextLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-800"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
    );
  }

  // 2. Safe Access
  const activeSocieties = (societies || [])
      .filter(s => s.status === 'active')
      .sort((a, b) => a.societyName.localeCompare(b.societyName));

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep1 = async () => {
    if (!formData.societyName || !formData.applicantPosition || !formData.applicantRegNo || !formData.applicantEmail) {
      setValidationError('Please fill all required fields marked with *');
      return false;
    }
    // Validation passed (Backend verification happens on submit/specific endpoint if needed)
    setValidationError('');
    return true;
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const isValid = await validateStep1();
      if (!isValid) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiService.events.request(formData);
      addActivityLog('Event Permission Requested', formData.eventName, 'user', formData.applicantName);
      alert("Event permission request submitted successfully!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step Components ---

  const Step1Applicant = () => (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
          <User className="w-5 h-5 text-maroon-800" />
          <h2 className="text-xl font-semibold text-gray-800">Applicant Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Society Name <span className="text-red-500">*</span></label>
            <select
                name="societyName"
                value={formData.societyName}
                onChange={(e) => updateFormData({societyName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500"
                required
            >
              <option value="">Select Society...</option>
              {activeSocieties.map(s => <option key={s.id} value={s.societyName}>{s.societyName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position <span className="text-red-500">*</span></label>
            <select
                name="applicantPosition"
                value={formData.applicantPosition}
                onChange={(e) => updateFormData({applicantPosition: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500"
                required
            >
              <option value="">Select Position...</option>
              <option value="President">President</option>
              <option value="Vice President">Vice President</option>
              <option value="Secretary">Secretary</option>
              <option value="Junior Treasurer">Junior Treasurer</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Personal Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Full Name" name="applicantName" value={formData.applicantName} onChange={(e) => updateFormData({applicantName: e.target.value})} required />
            <FormField label="Registration No" name="applicantRegNo" value={formData.applicantRegNo} onChange={(e) => updateFormData({applicantRegNo: e.target.value})} required />
            <FormField label="Email Address" name="applicantEmail" type="email" value={formData.applicantEmail} onChange={(e) => updateFormData({applicantEmail: e.target.value})} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty <span className="text-red-500">*</span></label>
              <select
                  name="applicantFaculty"
                  value={formData.applicantFaculty}
                  onChange={(e) => updateFormData({applicantFaculty: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500"
                  required
              >
                <option value="">Select Faculty...</option>
                {FACULTIES.map(faculty => <option key={faculty} value={faculty}>{faculty}</option>)}
              </select>
            </div>
            <FormField label="Mobile Number" name="applicantMobile" value={formData.applicantMobile} onChange={(e) => updateFormData({applicantMobile: e.target.value})} required />
          </div>
        </div>

        {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {validationError}
            </div>
        )}

        <div className="flex justify-end pt-4">
          <button onClick={nextStep} className="bg-maroon-800 text-white px-8 py-3 rounded-lg hover:bg-maroon-900 transition-colors shadow-sm font-medium">
            Next Step
          </button>
        </div>
      </div>
  );

  const Step2Event = () => (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
          <Calendar className="w-5 h-5 text-maroon-800" />
          <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
        </div>

        <FormField label="Event Name" name="eventName" value={formData.eventName} onChange={(e) => updateFormData({eventName: e.target.value})} required />

        <div className="grid md:grid-cols-3 gap-6">
          <FormField label="Date" name="eventDate" type="date" value={formData.eventDate} onChange={(e) => updateFormData({eventDate: e.target.value})} required />
          <FormField label="Start Time" name="timeFrom" type="time" value={formData.timeFrom} onChange={(e) => updateFormData({timeFrom: e.target.value})} required />
          <FormField label="End Time" name="timeTo" type="time" value={formData.timeTo} onChange={(e) => updateFormData({timeTo: e.target.value})} required />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" checked={formData.firstYearParticipation} onChange={e => updateFormData({firstYearParticipation: e.target.checked})} className="mr-3 h-4 w-4 text-maroon-800 focus:ring-maroon-500" />
            <span className="font-medium text-gray-800">First Year Students Participating?</span>
          </label>
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
          <button onClick={nextStep} className="bg-maroon-800 text-white px-8 py-2 rounded-lg hover:bg-maroon-900 shadow-sm">Next</button>
        </div>
      </div>
  );

  const Step3Logistics = () => (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
          <MapPin className="w-5 h-5 text-maroon-800" />
          <h2 className="text-xl font-semibold text-gray-800">Logistics</h2>
        </div>

        <FormField label="Place / Venue" name="place" value={formData.place} onChange={(e) => updateFormData({place: e.target.value})} required />

        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" checked={formData.isInsideUniversity} onChange={e => updateFormData({isInsideUniversity: e.target.checked})} className="mr-3 h-4 w-4 text-maroon-800" />
            Inside University
          </label>
          <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" checked={formData.latePassRequired} onChange={e => updateFormData({latePassRequired: e.target.checked})} className="mr-3 h-4 w-4 text-maroon-800" />
            Late Pass Required
          </label>
          <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" checked={formData.outsidersInvited} onChange={e => updateFormData({outsidersInvited: e.target.checked})} className="mr-3 h-4 w-4 text-maroon-800" />
            Outsiders Invited
          </label>
        </div>

        {formData.outsidersInvited && (
            <div className="animate-fade-in-down">
              <FormField label="List of Outsiders (Names/IDs)" name="outsidersList" value={formData.outsidersList} onChange={(e) => updateFormData({outsidersList: e.target.value})} required as="textarea" />
            </div>
        )}

        <div className="mt-6 border-t pt-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Premises Officer Details (If known)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField label="Name" name="premisesOfficerName" value={formData.premisesOfficerName} onChange={(e) => updateFormData({premisesOfficerName: e.target.value})} />
            <FormField label="Designation" name="premisesOfficerDesignation" value={formData.premisesOfficerDesignation} onChange={(e) => updateFormData({premisesOfficerDesignation: e.target.value})} />
            <FormField label="Division" name="premisesOfficerDivision" value={formData.premisesOfficerDivision} onChange={(e) => updateFormData({premisesOfficerDivision: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
          <button onClick={nextStep} className="bg-maroon-800 text-white px-8 py-2 rounded-lg hover:bg-maroon-900 shadow-sm">Next</button>
        </div>
      </div>
  );

  const Step4Finance = () => (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
          <DollarSign className="w-5 h-5 text-maroon-800" />
          <h2 className="text-xl font-semibold text-gray-800">Finance</h2>
        </div>

        <FormField label="Budget Estimate (LKR)" name="budgetEstimate" value={formData.budgetEstimate} onChange={(e) => updateFormData({budgetEstimate: e.target.value})} as="textarea" />
        <FormField label="Fund Collection Methods" name="fundCollectionMethods" value={formData.fundCollectionMethods} onChange={(e) => updateFormData({fundCollectionMethods: e.target.value})} />
        <FormField label="Student Fee Amount (if any)" name="studentFeeAmount" value={formData.studentFeeAmount} onChange={(e) => updateFormData({studentFeeAmount: e.target.value})} />

        <div className="mt-6 border-t pt-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Senior Treasurer Approval</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Name" name="seniorTreasurerName" value={formData.seniorTreasurerName} onChange={(e) => updateFormData({seniorTreasurerName: e.target.value})} />
            <FormField label="Department" name="seniorTreasurerDepartment" value={formData.seniorTreasurerDepartment} onChange={(e) => updateFormData({seniorTreasurerDepartment: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
          <button onClick={nextStep} className="bg-maroon-800 text-white px-8 py-2 rounded-lg hover:bg-maroon-900 shadow-sm">Next</button>
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-maroon-800">
            <div className="p-8">
              <div className="mb-8 text-center border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Event Permission Request</h1>
                <p className="text-gray-600 mt-2">Submit official requests for society activities and events.</p>
              </div>

              <StepIndicator steps={steps} currentStep={currentStep} />

              <div className="mt-10">
                {currentStep === 0 && <Step1Applicant />}
                {currentStep === 1 && <Step2Event />}
                {currentStep === 2 && <Step3Logistics />}
                {currentStep === 3 && <Step4Finance />}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Review Application</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <p><strong className="text-gray-600">Society:</strong> <br/>{formData.societyName}</p>
                          <p><strong className="text-gray-600">Event:</strong> <br/>{formData.eventName}</p>
                          <p><strong className="text-gray-600">Date:</strong> <br/>{formData.eventDate}</p>
                          <p><strong className="text-gray-600">Applicant:</strong> <br/>{formData.applicantName}</p>
                        </div>
                      </div>
                      <ReviewStep
                          formData={{
                            applicantFullName: formData.applicantName,
                            societyName: formData.societyName,
                            // @ts-ignore
                            eventName: formData.eventName
                          }}
                          onSubmit={handleSubmit}
                          onPrev={prevStep}
                      />
                    </div>
                )}

                {isSubmitting && (
                    <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-maroon-800 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-lg font-medium text-gray-800">Submitting Request...</p>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EventPermissionPage;