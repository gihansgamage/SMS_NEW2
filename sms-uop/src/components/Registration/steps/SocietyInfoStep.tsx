import React from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { SocietyRegistration, AdvisoryBoardMember } from '../../../types';
import FormField from '../../Common/FormField';
import { validateStaffEmail, validateMobile } from '../../../utils/validation';

interface SocietyInfoStepProps {
  formData: Partial<SocietyRegistration>;
  updateFormData: (updates: Partial<SocietyRegistration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SocietyInfoStep: React.FC<SocietyInfoStepProps> = ({
                                                           formData,
                                                           updateFormData,
                                                           onNext,
                                                           onPrev
                                                         }) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSeniorTreasurerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      seniorTreasurer: {
        ...(formData.seniorTreasurer || {}),
        [name]: value
      }
    } as Partial<SocietyRegistration>);

    // Clear error when user starts typing
    if (errors[`seniorTreasurer.${name}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`seniorTreasurer.${name}`];
        return newErrors;
      });
    }
  };

  const addAdvisoryMember = () => {
    const newMember: AdvisoryBoardMember = { name: '', designation: '', department: '' };
    updateFormData({
      advisoryBoard: [...(formData.advisoryBoard || []), newMember]
    });
  };

  const removeAdvisoryMember = (index: number) => {
    const updated = formData.advisoryBoard?.filter((_, i) => i !== index) || [];
    updateFormData({ advisoryBoard: updated });
  };

  const updateAdvisoryMember = (index: number, field: keyof AdvisoryBoardMember, value: string) => {
    const updated = formData.advisoryBoard?.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
    ) || [];
    updateFormData({ advisoryBoard: updated });
  };

  const handleNext = () => {
    const required = ['societyName', 'aims'];
    const seniorTreasurerRequired = ['title', 'name', 'designation', 'department', 'email', 'address', 'mobile'];
    const newErrors: { [key: string]: string } = {};

    // Validate basic fields
    required.forEach(field => {
      if (!formData[field as keyof SocietyRegistration]) {
        newErrors[field] = `${field} is required`;
      }
    });

    // Validate senior treasurer
    seniorTreasurerRequired.forEach(field => {
      const value = formData.seniorTreasurer?.[field as keyof typeof formData.seniorTreasurer];
      if (!value || value.trim() === '') {
        newErrors[`seniorTreasurer.${field}`] = `Senior treasurer ${field} is required`;
      } else {
        // Specific validation
        if (field === 'email') {
          const emailError = validateStaffEmail(value);
          if (emailError) newErrors[`seniorTreasurer.${field}`] = emailError;
        } else if (field === 'mobile') {
          const mobileError = validateMobile(value);
          if (mobileError) newErrors[`seniorTreasurer.${field}`] = mobileError;
        }
      }
    });

    // Validate advisory board
    if (!formData.advisoryBoard || formData.advisoryBoard.length === 0) {
      newErrors.advisoryBoard = 'At least one advisory board member is required';
    } else {
      formData.advisoryBoard.forEach((member, index) => {
        if (!member.name || member.name.trim() === '') {
          newErrors[`advisoryBoard.${index}.name`] = 'Advisory board member name is required';
        }
        if (!member.designation || member.designation.trim() === '') {
          newErrors[`advisoryBoard.${index}.designation`] = 'Advisory board member designation is required';
        }
        if (!member.department || member.department.trim() === '') {
          newErrors[`advisoryBoard.${index}.department`] = 'Advisory board member department is required';
        }
      });
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

  return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Society Information</h2>

        <div className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <FormField
                label="Society Name"
                name="societyName"
                value={formData.societyName || ''}
                onChange={handleChange}
                error={errors.societyName}
                required
            />

            <FormField
                label="Aims and Objectives"
                name="aims"
                as="textarea"
                rows={4}
                value={formData.aims || ''}
                onChange={handleChange}
                error={errors.aims}
                required
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Senior Treasurer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                  label="Title"
                  name="title"
                  value={formData.seniorTreasurer?.title || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.title']}
                  required
              />
              <FormField
                  label="Full Name"
                  name="name"
                  value={formData.seniorTreasurer?.name || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.name']}
                  required
              />
              <FormField
                  label="Designation"
                  name="designation"
                  value={formData.seniorTreasurer?.designation || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.designation']}
                  required
              />
              <FormField
                  label="Department"
                  name="department"
                  value={formData.seniorTreasurer?.department || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.department']}
                  required
              />
              <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.seniorTreasurer?.email || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.email']}
                  validate={validateStaffEmail}
                  required
              />
              <FormField
                  label="Mobile Number"
                  name="mobile"
                  value={formData.seniorTreasurer?.mobile || ''}
                  onChange={handleSeniorTreasurerChange}
                  error={errors['seniorTreasurer.mobile']}
                  validate={validateMobile}
                  required
              />
              <div className="md:col-span-2">
                <FormField
                    label="Address"
                    name="address"
                    value={formData.seniorTreasurer?.address || ''}
                    onChange={handleSeniorTreasurerChange}
                    error={errors['seniorTreasurer.address']}
                    required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Advisory Board Members</h3>
              <button
                  type="button"
                  onClick={addAdvisoryMember}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>

            {formData.advisoryBoard?.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Advisory Member {index + 1}</span>
                    {formData.advisoryBoard!.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeAdvisoryMember(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                        type="text"
                        placeholder="Name *"
                        value={member.name}
                        onChange={(e) => updateAdvisoryMember(index, 'name', e.target.value)}
                        className={`block w-full rounded-lg border px-3 py-2 ${
                            errors[`advisoryBoard.${index}.name`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Designation *"
                        value={member.designation}
                        onChange={(e) => updateAdvisoryMember(index, 'designation', e.target.value)}
                        className={`block w-full rounded-lg border px-3 py-2 ${
                            errors[`advisoryBoard.${index}.designation`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Department *"
                        value={member.department}
                        onChange={(e) => updateAdvisoryMember(index, 'department', e.target.value)}
                        className={`block w-full rounded-lg border px-3 py-2 ${
                            errors[`advisoryBoard.${index}.department`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        required
                    />
                  </div>
                  {(errors[`advisoryBoard.${index}.name`] || errors[`advisoryBoard.${index}.designation`] || errors[`advisoryBoard.${index}.department`]) && (
                      <div className="mt-2 text-sm text-red-600">
                        {errors[`advisoryBoard.${index}.name`] || errors[`advisoryBoard.${index}.designation`] || errors[`advisoryBoard.${index}.department`]}
                      </div>
                  )}
                </div>
            ))}
            {errors.advisoryBoard && (
                <div className="text-sm text-red-600 mt-2">{errors.advisoryBoard}</div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                  label="Bank Account Number"
                  name="bankAccount"
                  value={formData.bankAccount || ''}
                  onChange={handleChange}
              />
              <FormField
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName || ''}
                  onChange={handleChange}
              />
            </div>
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

export default SocietyInfoStep;