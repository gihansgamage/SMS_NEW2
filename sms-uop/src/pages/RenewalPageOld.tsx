import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FACULTIES, SocietyRenewal, AdvisoryBoardMember, CommitteeMember, Member, PlanningEvent } from '../types';
import StepIndicator from '../components/Common/StepIndicator';
import ApplicantInfoStep from '../components/Registration/steps/ApplicantInfoStep';
import SocietyInfoStep from '../components/Registration/steps/SocietyInfoStep';
import OfficialsStep from '../components/Registration/steps/OfficialsStep';
import MembersStep from '../components/Registration/steps/MembersStep';
import ReviewStep from '../components/Registration/steps/ReviewStep';

const steps = [
  { title: 'Applicant', description: 'Personal information' },
  { title: 'Society', description: 'Basic details' },
  { title: 'Officials', description: 'Committee members' },
  { title: 'Members', description: 'Society members' },
  { title: 'Review', description: 'Final review' }
];

const RenewalPage: React.FC = () => {
  const navigate = useNavigate();
  const { societies, addRenewal, addActivityLog } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Partial<SocietyRenewal>>({
    applicantFullName: '',
    applicantRegNo: '',
    applicantEmail: '',
    applicantFaculty: '',
    applicantMobile: '',
    societyName: '',
    seniorTreasurer: {
      title: '',
      name: '',
      designation: '',
      department: '',
      email: '',
      address: '',
      mobile: ''
    },
    advisoryBoard: [{ name: '', designation: '', department: '' }],
    bankAccount: '',
    bankName: '',
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

  const activeSocieties = societies.filter(s => s.status === 'active');

  const updateFormData = (updates: Partial<SocietyRenewal>) => {
    setFormData(prev => ({ ...prev, ...updates }));

    // Clear related errors when data is updated
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {};

    if (!formData.bankAccount || formData.bankAccount.trim() === '') {
      newErrors.bankAccount = 'Bank account is required for renewal';
    }

    if (!formData.bankName || formData.bankName.trim() === '') {
      newErrors.bankName = 'Bank name is required for renewal';
    }

    if (!formData.difficulties || formData.difficulties.trim() === '') {
      newErrors.difficulties = 'Please describe difficulties faced during the previous year';
    }

    if (!formData.previousActivities || formData.previousActivities.length === 0) {
      newErrors.previousActivities = 'Please add at least one previous activity';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const renewal: SocietyRenewal = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending_dean',
      isDeanApproved: false,
      isARApproved: false,
      isVCApproved: false,
      submittedDate: new Date().toISOString(),
      year: new Date().getFullYear()
    } as SocietyRenewal;

    addRenewal(renewal);
    addActivityLog(
        'Society Renewal Submitted',
        renewal.societyName,
        'user-' + renewal.applicantRegNo,
        renewal.applicantFullName
    );

    alert(`Renewal application submitted successfully! A confirmation email has been sent to ${renewal.applicantEmail}`);
    navigate('/');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
            <ApplicantInfoStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
            />
        );
      case 1:
        return (
            <SocietyInfoStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
                isRenewal={true}
                activeSocieties={activeSocieties}
                errors={errors}
            />
        );
      case 2:
        return (
            <OfficialsStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
            />
        );
      case 3:
        return (
            <MembersStep
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
                isRenewal={true}
            />
        );
      case 4:
        return (
            <ReviewStep
                formData={formData}
                onSubmit={handleSubmit}
                onPrev={prevStep}
                isRenewal={true}
            />
        );
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Society Renewal</h1>
              <p className="text-gray-600">Renew your existing society registration with the University of Peradeniya</p>
            </div>

            <StepIndicator steps={steps} currentStep={currentStep} />

            {renderStep()}
          </div>
        </div>
      </div>
  );
};

export default RenewalPage;