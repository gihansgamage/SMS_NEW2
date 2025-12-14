import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FACULTIES, SocietyRegistration, AdvisoryBoardMember, CommitteeMember, Member, PlanningEvent } from '../../types';
import { apiService } from '../../services/api';
import StepIndicator from '../Common/StepIndicator';
import ApplicantInfoStep from './steps/ApplicantInfoStep';
import SocietyInfoStep from './steps/SocietyInfoStep';
import OfficialsStep from './steps/OfficialsStep';
import MembersStep from './steps/MembersStep';
import ReviewStep from './steps/ReviewStep';
import { CheckCircle, Eye, Download, Send, Loader, Home } from 'lucide-react';

const steps = [
  { title: 'Applicant', description: 'Personal information' },
  { title: 'Society', description: 'Basic details' },
  { title: 'Officials', description: 'Committee members' },
  { title: 'Members', description: 'Society members' },
  { title: 'Review', description: 'Final review' }
];

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showFinalPage, setShowFinalPage] = useState(false);
  const [formData, setFormData] = useState<Partial<SocietyRegistration>>({
    applicantFullName: '',
    applicantRegNo: '',
    applicantEmail: '',
    applicantFaculty: '',
    applicantMobile: '',
    societyName: '',
    aims: '',
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
    planningEvents: [{ date: '', activity: '' }]
  });

  const updateFormData = (updates: Partial<SocietyRegistration>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const registrationData = {
        applicantFullName: formData.applicantFullName,
        applicantRegNo: formData.applicantRegNo,
        applicantEmail: formData.applicantEmail,
        applicantFaculty: formData.applicantFaculty,
        applicantMobile: formData.applicantMobile,
        societyName: formData.societyName,
        aims: formData.aims,
        agmDate: formData.agmDate,
        bankAccount: formData.bankAccount,
        bankName: formData.bankName,
        seniorTreasurerTitle: formData.seniorTreasurer?.title,
        seniorTreasurerFullName: formData.seniorTreasurer?.name,
        seniorTreasurerDesignation: formData.seniorTreasurer?.designation,
        seniorTreasurerDepartment: formData.seniorTreasurer?.department,
        seniorTreasurerEmail: formData.seniorTreasurer?.email,
        seniorTreasurerAddress: formData.seniorTreasurer?.address,
        seniorTreasurerMobile: formData.seniorTreasurer?.mobile,
        presidentRegNo: formData.president?.regNo,
        presidentName: formData.president?.name,
        presidentAddress: formData.president?.address,
        presidentEmail: formData.president?.email,
        presidentMobile: formData.president?.mobile,
        vicePresidentRegNo: formData.vicePresident?.regNo,
        vicePresidentName: formData.vicePresident?.name,
        vicePresidentAddress: formData.vicePresident?.address,
        vicePresidentEmail: formData.vicePresident?.email,
        vicePresidentMobile: formData.vicePresident?.mobile,
        secretaryRegNo: formData.secretary?.regNo,
        secretaryName: formData.secretary?.name,
        secretaryAddress: formData.secretary?.address,
        secretaryEmail: formData.secretary?.email,
        secretaryMobile: formData.secretary?.mobile,
        jointSecretaryRegNo: formData.jointSecretary?.regNo,
        jointSecretaryName: formData.jointSecretary?.name,
        jointSecretaryAddress: formData.jointSecretary?.address,
        jointSecretaryEmail: formData.jointSecretary?.email,
        jointSecretaryMobile: formData.jointSecretary?.mobile,
        juniorTreasurerRegNo: formData.juniorTreasurer?.regNo,
        juniorTreasurerName: formData.juniorTreasurer?.name,
        juniorTreasurerAddress: formData.juniorTreasurer?.address,
        juniorTreasurerEmail: formData.juniorTreasurer?.email,
        juniorTreasurerMobile: formData.juniorTreasurer?.mobile,
        editorRegNo: formData.editor?.regNo,
        editorName: formData.editor?.name,
        editorAddress: formData.editor?.address,
        editorEmail: formData.editor?.email,
        editorMobile: formData.editor?.mobile,
        advisoryBoard: formData.advisoryBoard,
        committeeMember: formData.committeeMember,
        member: formData.member,
        planningEvents: formData.planningEvents?.map(e => ({ month: e.date, activity: e.activity })),
        year: new Date().getFullYear()
      };

      console.log('Submitting registration:', registrationData);
      const response = await apiService.societies.register(registrationData);
      console.log('Registration response:', response.data);

      setSubmittedId(response.data.id);
      setShowSuccessPage(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Failed to submit registration:\n\n${errorMessage}\n\nPlease ensure the backend server is running on http://localhost:8080`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewApplication = () => {
    setCurrentStep(4);
    setShowSuccessPage(false);
  };

  const handleDownloadPDF = async () => {
    if (!submittedId) return;

    try {
      const response = await apiService.societies.downloadRegistrationPDF(submittedId.toString());
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registration_${submittedId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to download PDF. Please try again or contact support.');
    }
  };

  const handleSendForApproval = async () => {
    if (confirm('Are you sure you want to send this application for approval?\n\nThis will:\n• Notify the Faculty Dean for initial approval\n• Send a copy to the Senior Treasurer\n• Begin the official approval workflow')) {
      setShowSuccessPage(false);
      setShowFinalPage(true);
    }
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
            />
        );
      case 4:
        return (
            <ReviewStep
                formData={formData}
                onSubmit={handleSubmit}
                onPrev={prevStep}
            />
        );
      default:
        return null;
    }
  };

  if (showFinalPage) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6">
                  <Send className="w-16 h-16 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Sent for Approval!
              </h1>

              <p className="text-lg text-gray-700 mb-6">
                Your application for <strong>{formData.societyName}</strong> has been successfully submitted to the approval workflow.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Approval Process Started</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">Faculty Dean</div>
                      <div className="text-sm text-gray-600">Notification sent to {formData.applicantFaculty} Dean</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">Senior Treasurer</div>
                      <div className="text-sm text-gray-600">Notification sent to {formData.seniorTreasurer?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <div className="font-medium text-gray-700">Assistant Registrar</div>
                      <div className="text-sm text-gray-600">Pending Dean approval</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <div className="font-medium text-gray-700">Vice Chancellor</div>
                      <div className="text-sm text-gray-600">Final approval stage</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> You will receive email notifications at each approval stage. The approval process typically takes 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>

              <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 mx-auto text-lg font-semibold"
              >
                <Home className="w-5 h-5" />
                <span>Go to Homepage</span>
              </button>
            </div>
          </div>
        </div>
    );
  }

  if (showSuccessPage) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h1>

              <p className="text-lg text-gray-700 mb-2">
                <strong>{formData.societyName}</strong>
              </p>

              <p className="text-gray-600 mb-8">
                Application ID: <span className="font-mono font-semibold text-blue-600">#{submittedId}</span>
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">What Happens Next?</h3>
                <div className="space-y-3 text-left text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <div>Your application has been saved successfully and is ready for the approval process</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <div>The approval workflow will begin: Dean → Assistant Registrar → Vice Chancellor</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <div>You will receive email notifications at each stage of the approval process</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                    <div>The typical approval process takes 5-7 business days</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> Notifications have been sent to your Faculty Dean and Senior Treasurer. Please check your email regularly for updates on your application status.
                    </p>
                  </div>
                </div>
              </div>

              <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 mx-auto text-lg font-semibold"
              >
                <Home className="w-5 h-5" />
                <span>Go to Homepage</span>
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Society Registration</h1>
              <p className="text-gray-600">Register your society with the University of Peradeniya</p>
            </div>

            <StepIndicator steps={steps} currentStep={currentStep} />

            {renderStep()}

            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
                    <div className="flex flex-col items-center">
                      <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting Application...</h3>
                      <p className="text-sm text-gray-600 text-center">
                        Please wait while we save your registration to the database.
                      </p>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default RegistrationForm;
