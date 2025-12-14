import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SocietyRegistration } from '../../../types';
import FormField from '../../Common/FormField';
import { validateStudentEmail, validateMobile, validateRegistrationNumber, validateStaffEmail } from '../../../utils/validation';

interface OfficialsStepProps {
  formData: Partial<SocietyRegistration>;
  updateFormData: (updates: Partial<SocietyRegistration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const OfficialsStep: React.FC<OfficialsStepProps> = ({
                                                       formData,
                                                       updateFormData,
                                                       onNext,
                                                       onPrev
                                                     }) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const updateOfficial = (officialType: string, field: string, value: string) => {
    updateFormData({
      [officialType]: {
        ...(formData[officialType as keyof SocietyRegistration] as Record<string, any>),
        [field]: value
      }
    });

    // Clear error when user starts typing
    if (errors[`${officialType}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${officialType}.${field}`];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const officials = ['president', 'vicePresident', 'juniorTreasurer', 'secretary', 'jointSecretary', 'editor'];
    const requiredFields = ['regNo', 'name', 'address', 'email', 'mobile'];
    const newErrors: { [key: string]: string } = {};

    // Validate all officials
    officials.forEach(official => {
      const officialData = formData[official as keyof SocietyRegistration] as Record<string, any> | undefined;

      requiredFields.forEach(field => {
        const value = officialData?.[field];
        if (!value || value.trim() === '') {
          newErrors[`${official}.${field}`] = `${field} is required`;
        } else {
          // Specific validation for each field type
          if (field === 'email') {
            const emailError = validateStudentEmail(value);
            if (emailError) newErrors[`${official}.${field}`] = emailError;
          } else if (field === 'mobile') {
            const mobileError = validateMobile(value);
            if (mobileError) newErrors[`${official}.${field}`] = mobileError;
          } else if (field === 'regNo') {
            const regNoError = validateRegistrationNumber(value);
            if (regNoError) newErrors[`${official}.${field}`] = regNoError;
          }
        }
      });
    });

    // Validate AGM date
    if (!formData.agmDate) {
      newErrors.agmDate = 'AGM date is required';
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

    onNext();
  };

  const renderOfficialSection = (title: string, officialKey: string) => (
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
              label="Registration Number"
              name="regNo"
              value={(formData[officialKey as keyof SocietyRegistration] as Record<string, any>)?.regNo || ''}
              onChange={(e) => updateOfficial(officialKey, 'regNo', e.target.value)}
              error={errors[`${officialKey}.regNo`]}
              required
          />
          <FormField
              label="Full Name"
              name="name"
              value={(formData[officialKey as keyof SocietyRegistration] as Record<string, any>)?.name || ''}
              onChange={(e) => updateOfficial(officialKey, 'name', e.target.value)}
              error={errors[`${officialKey}.name`]}
              required
          />
          <FormField
              label="Email Address"
              name="email"
              type="email"
              value={(formData[officialKey as keyof SocietyRegistration] as Record<string, any>)?.email || ''}
              onChange={(e) => updateOfficial(officialKey, 'email', e.target.value)}
              error={errors[`${officialKey}.email`]}
              validate={validateStudentEmail}
              required
          />
          <FormField
              label="Mobile Number"
              name="mobile"
              value={(formData[officialKey as keyof SocietyRegistration] as Record<string, any>)?.mobile || ''}
              onChange={(e) => updateOfficial(officialKey, 'mobile', e.target.value)}
              error={errors[`${officialKey}.mobile`]}
              validate={validateMobile}
              required
          />
          <div className="md:col-span-2">
            <FormField
                label="Address"
                name="address"
                value={(formData[officialKey as keyof SocietyRegistration] as Record<string, any>)?.address || ''}
                onChange={(e) => updateOfficial(officialKey, 'address', e.target.value)}
                error={errors[`${officialKey}.address`]}
                required
            />
          </div>
        </div>
      </div>
  );

  return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Society Officials</h2>

        <div className="space-y-6">
          {renderOfficialSection('President', 'president')}
          {renderOfficialSection('Vice President', 'vicePresident')}
          {renderOfficialSection('Junior Treasurer', 'juniorTreasurer')}
          {renderOfficialSection('Secretary', 'secretary')}
          {renderOfficialSection('Joint Secretary', 'jointSecretary')}
          {renderOfficialSection('Editor', 'editor')}

          <div className="border-t pt-6">
            <FormField
                label="Annual General Meeting Date"
                name="agmDate"
                type="date"
                value={formData.agmDate || ''}
                onChange={(e) => updateFormData({ agmDate: e.target.value })}
                error={errors.agmDate}
                required
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
              onClick={onPrev}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
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

export default OfficialsStep;