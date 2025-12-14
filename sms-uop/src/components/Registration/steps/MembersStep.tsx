import React from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { SocietyRegistration, SocietyRenewal, CommitteeMember, Member, PlanningEvent } from '../../../types';

interface MembersStepProps {
  formData: Partial<SocietyRegistration> | Partial<SocietyRenewal>;
  updateFormData: (updates: Partial<SocietyRegistration> | Partial<SocietyRenewal>) => void;
  onNext: () => void;
  onPrev: () => void;
  isRenewal?: boolean;
}

const MembersStep: React.FC<MembersStepProps> = ({
                                                   formData,
                                                   updateFormData,
                                                   onNext,
                                                   onPrev,
                                                   isRenewal = false
                                                 }) => {
  const addCommitteeMember = () => {
    const newMember: CommitteeMember = { regNo: '', name: '' };
    updateFormData({
      committeeMember: [...(formData.committeeMember || []), newMember]
    });
  };

  const removeCommitteeMember = (index: number) => {
    const updated = formData.committeeMember?.filter((_, i) => i !== index) || [];
    updateFormData({ committeeMember: updated });
  };

  const updateCommitteeMember = (index: number, field: keyof CommitteeMember, value: string) => {
    const updated = formData.committeeMember?.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
    ) || [];
    updateFormData({ committeeMember: updated });
  };

  const addMember = () => {
    const newMember: Member = { regNo: '', name: '' };
    updateFormData({
      member: [...(formData.member || []), newMember]
    });
  };

  const removeMember = (index: number) => {
    const updated = formData.member?.filter((_, i) => i !== index) || [];
    updateFormData({ member: updated });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updated = formData.member?.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
    ) || [];
    updateFormData({ member: updated });
  };

  const addPlanningEvent = () => {
    const newEvent: PlanningEvent = { month: '', activity: '' };
    updateFormData({
      planningEvents: [...(formData.planningEvents || []), newEvent]
    });
  };

  const removePlanningEvent = (index: number) => {
    const updated = formData.planningEvents?.filter((_, i) => i !== index) || [];
    updateFormData({ planningEvents: updated });
  };

  const updatePlanningEvent = (index: number, field: keyof PlanningEvent, value: string) => {
    const updated = formData.planningEvents?.map((event, i) =>
        i === index ? { ...event, [field]: value } : event
    ) || [];
    updateFormData({ planningEvents: updated });
  };

  const addPreviousActivity = () => {
    if (!isRenewal) return;
    const newActivity: PlanningEvent = { month: '', activity: '' };
    updateFormData({
      previousActivities: [...((formData as Partial<SocietyRenewal>).previousActivities || []), newActivity]
    });
  };

  const removePreviousActivity = (index: number) => {
    if (!isRenewal) return;
    const updated = (formData as Partial<SocietyRenewal>).previousActivities?.filter((_, i) => i !== index) || [];
    updateFormData({ previousActivities: updated });
  };

  const updatePreviousActivity = (index: number, field: keyof PlanningEvent, value: string) => {
    if (!isRenewal) return;
    const updated = (formData as Partial<SocietyRenewal>).previousActivities?.map((activity, i) =>
        i === index ? { ...activity, [field]: value } : activity
    ) || [];
    updateFormData({ previousActivities: updated });
  };

  const handleNext = () => {
    const hasCommitteeMembers = formData.committeeMember && formData.committeeMember.length > 0 &&
        formData.committeeMember.every(member => member.regNo && member.name);
    const hasMembers = formData.member && formData.member.length > 0 &&
        formData.member.every(member => member.regNo && member.name);
    const hasPlanningEvents = formData.planningEvents && formData.planningEvents.length > 0 &&
        formData.planningEvents.every(event => event.month && event.activity);

    let hasPreviousActivities = true;
    if (isRenewal) {
      hasPreviousActivities = (formData as Partial<SocietyRenewal>).previousActivities &&
          (formData as Partial<SocietyRenewal>).previousActivities!.length > 0;
    }

    if (!hasCommitteeMembers || !hasMembers || !hasPlanningEvents || !hasPreviousActivities) {
      // Show error message instead of alert
      const errorMessage = `Please add at least one committee member, general member, ${isRenewal ? 'previous activity, ' : ''}and planning event`;

      // Create error element if it doesn't exist
      let errorElement = document.getElementById('members-step-error');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'members-step-error';
        errorElement.className = 'mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2';
        errorElement.innerHTML = `
          <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-red-600">${errorMessage}</p>
        `;

        // Insert before the navigation buttons
        const navButtons = document.querySelector('.flex.justify-between.mt-8');
        if (navButtons && navButtons.parentNode) {
          navButtons.parentNode.insertBefore(errorElement, navButtons);
        }
      }

      // Scroll to error
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Remove error after 5 seconds
      setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 5000);

      return;
    }

    // Remove any existing error message
    const errorElement = document.getElementById('members-step-error');
    if (errorElement && errorElement.parentNode) {
      errorElement.parentNode.removeChild(errorElement);
    }

    onNext();
  };

  return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Members & Activities</h2>

        <div className="space-y-8">
          {/* Committee Members */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Committee Members</h3>
              <button
                  type="button"
                  onClick={addCommitteeMember}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {formData.committeeMember?.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Committee Member {index + 1}</span>
                    {formData.committeeMember!.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeCommitteeMember(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Registration Number *"
                        value={member.regNo}
                        onChange={(e) => updateCommitteeMember(index, 'regNo', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name *"
                        value={member.name}
                        onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                  </div>
                </div>
            ))}
          </div>

          {/* General Members */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">General Members</h3>
              <button
                  type="button"
                  onClick={addMember}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {formData.member?.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Member {index + 1}</span>
                    {formData.member!.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeMember(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Registration Number *"
                        value={member.regNo}
                        onChange={(e) => updateMember(index, 'regNo', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name *"
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                  </div>
                </div>
            ))}
          </div>

          {/* Previous Activities (Renewal Only) */}
          {isRenewal && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Previous Activities</h3>
                  <button
                      type="button"
                      onClick={addPreviousActivity}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {(formData as Partial<SocietyRenewal>).previousActivities?.map((activity, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700">Previous Activity {index + 1}</span>
                        {(formData as Partial<SocietyRenewal>).previousActivities!.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removePreviousActivity(index)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <select
                            value={activity.month}
                            onChange={(e) => updatePreviousActivity(index, 'month', e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                            required
                        >
                          <option value="">Select Month</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Activity Description *"
                            value={activity.activity}
                            onChange={(e) => updatePreviousActivity(index, 'activity', e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                            required
                        />
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Difficulties (Renewal Only) */}
          {isRenewal && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Difficulties Faced</h3>
                <textarea
                    placeholder="Describe any difficulties faced during the previous year..."
                    value={(formData as Partial<SocietyRenewal>).difficulties || ''}
                    onChange={(e) => updateFormData({ difficulties: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required={isRenewal}
                />
              </div>
          )}

          {/* Planning Events */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isRenewal ? 'Future Planning Events' : 'Planning Events'}
              </h3>
              <button
                  type="button"
                  onClick={addPlanningEvent}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {formData.planningEvents?.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">Event {index + 1}</span>
                    {formData.planningEvents!.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removePlanningEvent(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <select
                        value={event.month}
                        onChange={(e) => updatePlanningEvent(index, 'month', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Activity Description *"
                        value={event.activity}
                        onChange={(e) => updatePlanningEvent(index, 'activity', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                    />
                  </div>
                </div>
            ))}
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

export default MembersStep;