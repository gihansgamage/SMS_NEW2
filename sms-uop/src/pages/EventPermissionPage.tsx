import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import StepIndicator from '../components/Common/StepIndicator';
import FormField from '../components/Common/FormField';
import ReviewStep from '../components/Registration/steps/ReviewStep';
import { apiService } from '../services/api';
import { FACULTIES } from '../types';
import { Calendar, MapPin, DollarSign, User, Loader2, Info } from 'lucide-react';

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
    const [isAutoFilling, setIsAutoFilling] = useState(false);

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

    // Auto-Fill Effect
    useEffect(() => {
        const autoFillApplicant = async () => {
            if (formData.societyName && formData.applicantPosition) {
                setIsAutoFilling(true);
                try {
                    // Fetch official details from backend
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
                } catch (error) {
                    console.error("Auto-fill failed:", error);
                    // Allow manual entry if auto-fill fails
                } finally {
                    setIsAutoFilling(false);
                }
            }
        };

        const timeoutId = setTimeout(autoFillApplicant, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.societyName, formData.applicantPosition]);

    if (contextLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin h-10 w-10 text-[#800000]"/></div>;

    // Filter Active Societies
    const activeSocieties = (societies || [])
        .filter(s => s.status && s.status.toLowerCase() === 'active')
        .sort((a, b) => a.societyName.localeCompare(b.societyName));

    const updateFormData = (updates: any) => setFormData(prev => ({ ...prev, ...updates }));

    const validateStep1 = async () => {
        if (!formData.societyName || !formData.applicantPosition || !formData.applicantRegNo || !formData.applicantEmail) {
            setValidationError('Please fill all required fields (*)'); return false;
        }
        setValidationError(''); return true;
    };

    const validateStep2 = () => {
        if (!formData.eventName || !formData.eventDate || !formData.timeFrom || !formData.timeTo) {
            setValidationError('Please fill all event details.'); return false;
        }
        const today = new Date(); today.setHours(0,0,0,0);
        const selectedDate = new Date(formData.eventDate);
        if (selectedDate < today) { setValidationError('Event date cannot be in the past.'); return false; }
        if (formData.timeFrom >= formData.timeTo) { setValidationError('End time must be after start time.'); return false; }
        setValidationError(''); return true;
    };

    const nextStep = async () => {
        if (currentStep === 0) { if (!(await validateStep1())) return; }
        if (currentStep === 1) { if (!validateStep2()) return; }
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

    const Step1Applicant = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Applicant Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Society Name <span className="text-red-500">*</span></label>
                    <select name="societyName" value={formData.societyName} onChange={(e) => updateFormData({societyName: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-[#800000] focus:border-[#800000]" required>
                        <option value="">Select Society...</option>
                        {activeSocieties.map(s => <option key={s.id} value={s.societyName}>{s.societyName}</option>)}
                    </select>
                    {activeSocieties.length === 0 && <p className="text-xs text-red-600 mt-1">No active societies found.</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Position <span className="text-red-500">*</span></label>
                    <select name="applicantPosition" value={formData.applicantPosition} onChange={(e) => updateFormData({applicantPosition: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-[#800000] focus:border-[#800000]" required>
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

            <div className="relative bg-gray-50 p-6 rounded-lg border border-gray-200 mt-4">
                {isAutoFilling && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg z-10 backdrop-blur-[1px]">
                        <div className="flex items-center bg-white px-4 py-2 rounded shadow-md border border-gray-200">
                            <Loader2 className="w-5 h-5 text-[#800000] animate-spin mr-2"/>
                            <span className="text-sm font-medium text-gray-700">Fetching official details...</span>
                        </div>
                    </div>
                )}

                <div className="mb-4 flex items-center text-sm text-blue-800 bg-blue-50 p-3 rounded border border-blue-100">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                    <p>Details will auto-fill based on the selected society and position. You can edit them if necessary.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField label="Full Name" name="applicantName" value={formData.applicantName} onChange={(e) => updateFormData({applicantName: e.target.value})} required />
                    <FormField label="Registration No" name="applicantRegNo" value={formData.applicantRegNo} onChange={(e) => updateFormData({applicantRegNo: e.target.value})} required />
                    <FormField label="Email Address" name="applicantEmail" type="email" value={formData.applicantEmail} onChange={(e) => updateFormData({applicantEmail: e.target.value})} required />
                    <FormField label="Mobile Number" name="applicantMobile" value={formData.applicantMobile} onChange={(e) => updateFormData({applicantMobile: e.target.value})} required />
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Faculty <span className="text-red-500">*</span></label>
                        <select name="applicantFaculty" value={formData.applicantFaculty} onChange={(e) => updateFormData({applicantFaculty: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:ring-[#800000] focus:border-[#800000]" required>
                            <option value="">Select Faculty...</option>
                            {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {validationError && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-medium">{validationError}</div>}

            <div className="flex justify-end pt-4">
                <button type="button" onClick={nextStep} className="bg-[#800000] text-white px-8 py-2.5 rounded hover:bg-[#600000] transition-colors shadow-sm font-medium">Next Step</button>
            </div>
        </div>
    );

    // Simplified Step 2-4 (Reused logic, ensured type="button")
    const Step2Event = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <FormField label="Event Name" name="eventName" value={formData.eventName} onChange={(e) => updateFormData({eventName: e.target.value})} required />
            <div className="grid md:grid-cols-3 gap-6">
                <FormField label="Date" type="date" name="eventDate" value={formData.eventDate} onChange={(e) => updateFormData({eventDate: e.target.value})} required />
                <FormField label="Start Time" type="time" name="timeFrom" value={formData.timeFrom} onChange={(e) => updateFormData({timeFrom: e.target.value})} required />
                <FormField label="End Time" type="time" name="timeTo" value={formData.timeTo} onChange={(e) => updateFormData({timeTo: e.target.value})} required />
            </div>
            {validationError && <p className="text-red-600 text-sm font-medium">{validationError}</p>}
            <div className="flex justify-between mt-8"><button type="button" onClick={prevStep} className="bg-gray-200 px-6 py-2 rounded text-gray-700">Back</button><button type="button" onClick={nextStep} className="bg-[#800000] text-white px-6 py-2 rounded hover:bg-[#600000]">Next</button></div>
        </div>
    );

    const Step3Logistics = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Logistics</h2>
            <FormField label="Place / Venue" name="place" value={formData.place} onChange={(e) => updateFormData({place: e.target.value})} required />
            <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={formData.isInsideUniversity} onChange={e => updateFormData({isInsideUniversity: e.target.checked})} className="mr-3"/> Inside Uni</label>
                <label className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={formData.latePassRequired} onChange={e => updateFormData({latePassRequired: e.target.checked})} className="mr-3"/> Late Pass</label>
                <label className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={formData.outsidersInvited} onChange={e => updateFormData({outsidersInvited: e.target.checked})} className="mr-3"/> Outsiders</label>
            </div>
            {formData.outsidersInvited && <FormField label="Outsiders List" name="outsidersList" value={formData.outsidersList} onChange={(e) => updateFormData({outsidersList: e.target.value})} as="textarea"/>}
            <div className="flex justify-between mt-8"><button type="button" onClick={prevStep} className="bg-gray-200 px-6 py-2 rounded text-gray-700">Back</button><button type="button" onClick={nextStep} className="bg-[#800000] text-white px-6 py-2 rounded hover:bg-[#600000]">Next</button></div>
        </div>
    );

    const Step4Finance = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold">Finance</h2>
            <FormField label="Budget" name="budgetEstimate" value={formData.budgetEstimate} onChange={(e) => updateFormData({budgetEstimate: e.target.value})} as="textarea"/>
            <FormField label="Fund Collection" name="fundCollectionMethods" value={formData.fundCollectionMethods} onChange={(e) => updateFormData({fundCollectionMethods: e.target.value})}/>
            <div className="flex justify-between mt-8"><button type="button" onClick={prevStep} className="bg-gray-200 px-6 py-2 rounded text-gray-700">Back</button><button type="button" onClick={nextStep} className="bg-[#800000] text-white px-6 py-2 rounded hover:bg-[#600000]">Next</button></div>
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
                        {currentStep === 4 && <ReviewStep formData={{ applicantFullName: formData.applicantName, societyName: formData.societyName,
                            // @ts-ignore
                            eventName: formData.eventName }} onSubmit={handleSubmit} onPrev={prevStep} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPermissionPage;