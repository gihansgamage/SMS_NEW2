import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SocietyRegistration, FACULTIES } from '../../../types';
import FormField from '../../Common/FormField';
import { validateEmail, validateMobile, validateRegistrationNumber } from '../../../utils/validation';

interface ApplicantInfoStepProps {
  formData: Partial<SocietyRegistration>;
  updateFormData: (updates: Partial<SocietyRegistration>) => void;
  onNext: () => void;
}

const ApplicantInfoStep: React.FC<ApplicantInfoStepProps> = ({
                                                               formData,
                                                               updateFormData,
                                                               onNext
                                                             }) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value } as Partial<SocietyRegistration>);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const required = ['applicantFullName', 'applicantRegNo', 'applicantEmail', 'applicantFaculty', 'applicantMobile'];
    const newErrors: { [key: string]: string } = {};

    required.forEach(field => {
      const value = formData[field as keyof SocietyRegistration] as string;
      if (!value || value.trim() === '') {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      } else {
        // Specific validation
        if (field === 'applicantEmail') {
          const emailError = validateEmail(value);
          if (emailError) newErrors[field] = emailError;
        } else if (field === 'applicantMobile') {
          const mobileError = validateMobile(value);
          if (mobileError) newErrors[field] = mobileError;
        } else if (field === 'applicantRegNo') {
          const regNoError = validateRegistrationNumber(value);
          if (regNoError) newErrors[field] = regNoError;
        }
      }
    });

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

    onNext();
  };

  return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Applicant Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
              label="Full Name"
              name="applicantFullName"
              value={formData.applicantFullName || ''}
              onChange={handleChange}
              error={errors.applicantFullName}
              required
          />

          <FormField
              label="Registration Number"
              name="applicantRegNo"
              value={formData.applicantRegNo || ''}
              onChange={handleChange}
              error={errors.applicantRegNo}
              validate={validateRegistrationNumber}
              required
          />

          <FormField
              label="Email Address"
              name="applicantEmail"
              type="email"
              value={formData.applicantEmail || ''}
              onChange={handleChange}
              error={errors.applicantEmail}
              validate={validateEmail}
              required
          />

          <FormField
              label="Faculty"
              name="applicantFaculty"
              as="select"
              options={FACULTIES}
              value={formData.applicantFaculty || ''}
              onChange={handleChange}
              error={errors.applicantFaculty}
              required
          />

          <FormField
              label="Mobile Number"
              name="applicantMobile"
              value={formData.applicantMobile || ''}
              onChange={handleChange}
              error={errors.applicantMobile}
              validate={validateMobile}
              required
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
  );
};

export default ApplicantInfoStep;