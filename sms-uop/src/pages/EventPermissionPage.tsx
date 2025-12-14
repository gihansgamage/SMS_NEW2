import React, { useState, useEffect } from 'react';
// ... imports same as before ...
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import StepIndicator from '../components/Common/StepIndicator';
import FormField from '../components/Common/FormField';
import ReviewStep from '../components/Registration/steps/ReviewStep';
import { apiService } from '../services/api';
import { FACULTIES } from '../types';
import { Calendar, MapPin, DollarSign, User, Loader2 } from 'lucide-react';

// ... steps array same as before ...
const steps = [
    { title: 'Applicant', description: 'Personal details' },
    { title: 'Event', description: 'Main event info' },
    { title: 'Logistics', description: 'Venue & Participants' },
    { title: 'Finance', description: 'Budget & Funding' },
    { title: 'Review', description: 'Final check' }
];

const EventPermissionPage: React.FC = () => {
    // ... hooks and state same as before ...
    const navigate = useNavigate();
    const { societies, loading: contextLoading, addActivityLog } = useData();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [isAutoFilling, setIsAutoFilling] = useState(false);

    const [formData, setFormData] = useState({
        // ... same initial state ...
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

    // ... useEffect for auto-fill same as before ...
    useEffect(() => {
        const autoFillApplicant = async () => {
            if (formData.societyName && formData.applicantPosition) {
                setIsAutoFilling(true);
                try {
                    const response = await apiService.events.getApplicantDetails(formData.societyName, formData.applicantPosition);
                    const details = response.data;
                    setFormData(prev => ({
                        ...prev,
                        applicantName: details.name || '',
                        applicantRegNo: details.regNo || '',
                        applicantEmail: details.email || '',
                        applicantMobile: details.mobile || '',
                        applicantFaculty: details.faculty || ''
                    }));
                } catch (error) { console.error(error); } finally { setIsAutoFilling(false); }
            }
        };
        const timeoutId = setTimeout(autoFillApplicant, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.societyName, formData.applicantPosition]);

    if (contextLoading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><Loader2 className="h-12 w-12 text-[#800000] animate-spin mb-4" /><p>Loading...</p></div>;

    const activeSocieties = (societies || []).filter(s => s.status && s.status.toLowerCase() === 'active').sort((a, b) => a.societyName.localeCompare(b.societyName));
    const updateFormData = (updates: any) => setFormData(prev => ({ ...prev, ...updates }));

    // --- Step 1 Validation ---
    const validateStep1 = async () => {
        if (!formData.societyName || !formData.applicantPosition || !formData.applicantRegNo || !formData.applicantEmail) {
            setValidationError('Please fill all required fields (*)');
            return false;
        }
        setValidationError('');
        return true;
    };

    // --- NEW: Step 2 Validation (Date & Time) ---
    const validateStep2 = () => {
        if (!formData.eventName || !formData.eventDate || !formData.timeFrom || !formData.timeTo) {
            setValidationError('Please fill all event details.');
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(formData.eventDate);

        if (selectedDate < today) {
            setValidationError('Event date cannot be in the past.');
            return false;
        }

        if (formData.timeFrom >= formData.timeTo) {
            setValidationError('End time must be after start time.');
            return false;
        }

        setValidationError('');
        return true;
    };

    const nextStep = async () => {
        if (currentStep === 0) { if (!(await validateStep1())) return; }
        if (currentStep === 1) { if (!validateStep2()) return; } // Added check

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
            alert("Failed to submit request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... Step1Applicant component same as before ...
    const Step1Applicant = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
                <User className="w-5 h-5 text-[#800000]" />
                <h2 className="text-xl font-semibold text-gray-800">Applicant Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Society Name <span className="text-red-500">*</span></label>
                    <select name="societyName" value={formData.societyName} onChange={(e) => updateFormData({societyName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]" required>
                        <option value="">Select Society...</option>
                        {activeSocieties.map(s => <option key={s.id} value={s.societyName}>{s.societyName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position <span className="text-red-500">*</span></label>
                    <select name="applicantPosition" value={formData.applicantPosition} onChange={(e) => updateFormData({applicantPosition: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]" required>
                        <option value="">Select Position...</option>
                        <option value="President">President</option>
                        <option value="Vice President">Vice President</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Joint Secretary">Joint Secretary</option>
                        <option value="Junior Treasurer">Junior Treasurer</option>
                        <option value="Editor">Editor</option>
                    </select>
                </div>
            </div>
            <div className="relative bg-gray-50 p-6 rounded-lg border border-gray-100 mt-4">
                {isAutoFilling && <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10"><Loader2 className="w-6 h-6 text-[#800000] animate-spin" /><span className="ml-2 text-sm text-gray-600">Auto-filling...</span></div>}
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField label="Full Name" name="applicantName" value={formData.applicantName} onChange={(e) => updateFormData({applicantName: e.target.value})} required />
                    <FormField label="Registration No" name="applicantRegNo" value={formData.applicantRegNo} onChange={(e) => updateFormData({applicantRegNo: e.target.value})} required />
                    <FormField label="Email Address" name="applicantEmail" type="email" value={formData.applicantEmail} onChange={(e) => updateFormData({applicantEmail: e.target.value})} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty <span className="text-red-500">*</span></label>
                        <select name="applicantFaculty" value={formData.applicantFaculty} onChange={(e) => updateFormData({applicantFaculty: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]" required>
                            <option value="">Select Faculty...</option>
                            {FACULTIES.map(faculty => <option key={faculty} value={faculty}>{faculty}</option>)}
                        </select>
                    </div>
                    <FormField label="Mobile Number" name="applicantMobile" value={formData.applicantMobile} onChange={(e) => updateFormData({applicantMobile: e.target.value})} required />
                </div>
            </div>
            {validationError && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">{validationError}</div>}
            <div className="flex justify-end pt-4">
                <button type="button" onClick={nextStep} className="bg-[#800000] text-white px-8 py-3 rounded-lg hover:bg-[#600000] transition-colors shadow-sm font-medium">Next Step</button>
            </div>
        </div>
    );

    const Step2Event = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
                <Calendar className="w-5 h-5 text-[#800000]" />
                <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
            </div>

            <FormField label="Event Name" name="eventName" value={formData.eventName} onChange={(e) => updateFormData({eventName: e.target.value})} required />

            <div className="grid md:grid-cols-3 gap-6">
                <FormField label="Date" name="eventDate" type="date" value={formData.eventDate} onChange={(e) => updateFormData({eventDate: e.target.value})} required />
                <FormField label="Start Time" name="timeFrom" type="time" value={formData.timeFrom} onChange={(e) => updateFormData({timeFrom: e.target.value})} required />
                <FormField label="End Time" name="timeTo" type="time" value={formData.timeTo} onChange={(e) => updateFormData({timeTo: e.target.value})} required />
            </div>

            {/* Show Error specifically for this step */}
            {validationError && <p className="text-red-600 font-medium text-sm">{validationError}</p>}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.firstYearParticipation} onChange={e => updateFormData({firstYearParticipation: e.target.checked})} className="mr-3 h-4 w-4 text-[#800000] focus:ring-[#800000]" />
                    <span className="font-medium text-gray-800">First Year Students Participating?</span>
                </label>
            </div>

            <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
                <button type="button" onClick={nextStep} className="bg-[#800000] text-white px-8 py-2 rounded-lg hover:bg-[#600000] shadow-sm">Next</button>
            </div>
        </div>
    );

    // ... (Other steps Step3Logistics, Step4Finance remain the same, just ensure type="button")
    const Step3Logistics = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800">Logistics</h2>
            <FormField label="Place / Venue" name="place" value={formData.place} onChange={(e) => updateFormData({place: e.target.value})} required />
            <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border rounded hover:bg-gray-50"><input type="checkbox" checked={formData.isInsideUniversity} onChange={e => updateFormData({isInsideUniversity: e.target.checked})} className="mr-3"/> Inside Uni</label>
                <label className="flex items-center p-4 border rounded hover:bg-gray-50"><input type="checkbox" checked={formData.latePassRequired} onChange={e => updateFormData({latePassRequired: e.target.checked})} className="mr-3"/> Late Pass</label>
                <label className="flex items-center p-4 border rounded hover:bg-gray-50"><input type="checkbox" checked={formData.outsidersInvited} onChange={e => updateFormData({outsidersInvited: e.target.checked})} className="mr-3"/> Outsiders</label>
            </div>
            {formData.outsidersInvited && <FormField label="Outsiders List" name="outsidersList" value={formData.outsidersList} onChange={(e) => updateFormData({outsidersList: e.target.value})} as="textarea"/>}
            <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
                <button type="button" onClick={nextStep} className="bg-[#800000] text-white px-8 py-2 rounded-lg hover:bg-[#600000] shadow-sm">Next</button>
            </div>
        </div>
    );

    const Step4Finance = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800">Finance</h2>
            <FormField label="Budget" name="budgetEstimate" value={formData.budgetEstimate} onChange={(e) => updateFormData({budgetEstimate: e.target.value})} as="textarea"/>
            <FormField label="Fund Collection" name="fundCollectionMethods" value={formData.fundCollectionMethods} onChange={(e) => updateFormData({fundCollectionMethods: e.target.value})}/>
            <div className="flex justify-between mt-8">
                <button type="button" onClick={prevStep} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Previous</button>
                <button type="button" onClick={nextStep} className="bg-[#800000] text-white px-8 py-2 rounded-lg hover:bg-[#600000] shadow-sm">Next</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#800000]">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900">Event Permission</h1>
                    <p className="text-gray-600 mb-8">Request official permission for society events</p>
                    <StepIndicator steps={steps} currentStep={currentStep} />
                    <div className="mt-8">
                        {currentStep === 0 && <Step1Applicant />}
                        {currentStep === 1 && <Step2Event />}
                        {currentStep === 2 && <Step3Logistics />}
                        {currentStep === 3 && <Step4Finance />}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="bg-gray-100 p-6 rounded-lg">
                                    <h2 className="text-xl font-bold mb-4">Review Details</h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p><strong>Society:</strong> {formData.societyName}</p>
                                        <p><strong>Event:</strong> {formData.eventName}</p>
                                        <p><strong>Date:</strong> {formData.eventDate}</p>
                                        <p><strong>Applicant:</strong> {formData.applicantName}</p>
                                    </div>
                                </div>
                                <ReviewStep formData={{ applicantFullName: formData.applicantName, societyName: formData.societyName,
                                    // @ts-ignore
                                    eventName: formData.eventName }} onSubmit={handleSubmit} onPrev={prevStep} />
                            </div>
                        )}
                        {isSubmitting && <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50"><div className="text-center"><Loader2 className="h-16 w-16 text-[#800000] animate-spin mx-auto mb-4" /><p className="text-lg font-medium text-gray-800">Submitting Request...</p></div></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPermissionPage;