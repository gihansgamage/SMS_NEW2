import React, { useState } from 'react';
import { ArrowLeft, Download, Send, FileText, Eye } from 'lucide-react';
import { SocietyRegistration } from '../../../types';
import EmailValidationIndicator from '../../Common/EmailValidationIndicator';
import { generateApplicationPDF } from '../../../utils/pdfGenerator';

interface ReviewStepProps {
  formData: Partial<SocietyRegistration>;
  onSubmit: () => void;
  onPrev: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
                                                 formData,
                                                 onSubmit,
                                                 onPrev
                                               }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownloadPDF = () => {
    generateApplicationPDF(formData);
  };

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit this application? Once submitted, it cannot be modified.')) {
      onSubmit();
    }
  };

  return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Application</h2>

        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {formData.applicantFullName}</div>
              <div><strong>Registration No:</strong> {formData.applicantRegNo}</div>
              <div><strong>Email:</strong> {formData.applicantEmail}</div>
              <div><strong>Faculty:</strong> {formData.applicantFaculty}</div>
              <div><strong>Mobile:</strong> {formData.applicantMobile}</div>
            </div>
          </div>

          {/* Society Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Society Information</h3>
            <div className="text-sm space-y-2">
              <div><strong>Society Name:</strong> {formData.societyName}</div>
              <div><strong>Aims:</strong> {formData.aims}</div>
              <div><strong>AGM Date:</strong> {formData.agmDate}</div>
            </div>
          </div>

          {/* Senior Treasurer */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Senior Treasurer</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {formData.seniorTreasurer?.name}</div>
              <div><strong>Title:</strong> {formData.seniorTreasurer?.title}</div>
              <div><strong>Department:</strong> {formData.seniorTreasurer?.department}</div>
              <div className="flex items-center space-x-2">
                <strong>Email:</strong>
                <span>{formData.seniorTreasurer?.email}</span>
                <EmailValidationIndicator
                    email={formData.seniorTreasurer?.email || ''}
                    position="senior_treasurer"
                />
              </div>
            </div>
          </div>

          {/* Key Officials Email Validation */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Validation Status</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span><strong>President:</strong> {formData.president?.name}</span>
                <EmailValidationIndicator
                    email={formData.president?.email || ''}
                    position="president"
                    showDetails
                />
              </div>
              <div className="flex items-center justify-between">
                <span><strong>Secretary:</strong> {formData.secretary?.name}</span>
                <EmailValidationIndicator
                    email={formData.secretary?.email || ''}
                    position="secretary"
                    showDetails
                />
              </div>
              <div className="flex items-center justify-between">
                <span><strong>Junior Treasurer:</strong> {formData.juniorTreasurer?.name}</span>
                <EmailValidationIndicator
                    email={formData.juniorTreasurer?.email || ''}
                    position="junior_treasurer"
                    showDetails
                />
              </div>
              <div className="flex items-center justify-between">
                <span><strong>Editor:</strong> {formData.editor?.name}</span>
                <EmailValidationIndicator
                    email={formData.editor?.email || ''}
                    position="editor"
                    showDetails
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Valid email addresses are essential for the admin communication center to send notifications and updates to society officials.
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formData.advisoryBoard?.length || 0}
              </div>
              <div className="text-sm text-blue-800">Advisory Board Members</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formData.member?.length || 0}
              </div>
              <div className="text-sm text-green-800">General Members</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formData.planningEvents?.length || 0}
              </div>
              <div className="text-sm text-purple-800">Planning Events</div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Application Preview</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Society Registration Application
                </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Applicant Information */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Full Name:</strong> {formData.applicantFullName}</div>
                        <div><strong>Registration No:</strong> {formData.applicantRegNo}</div>
                        <div><strong>Email:</strong> {formData.applicantEmail}</div>
                        <div><strong>Faculty:</strong> {formData.applicantFaculty}</div>
                        <div><strong>Mobile:</strong> {formData.applicantMobile}</div>
                      </div>
                    </div>

                    {/* Society Information */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Society Information</h4>
                      <div className="space-y-3 text-sm">
                        <div><strong>Society Name:</strong> {formData.societyName}</div>
                        <div><strong>AGM Date:</strong> {formData.agmDate}</div>
                        {formData.bankAccount && (
                            <>
                              <div><strong>Bank Account:</strong> {formData.bankAccount}</div>
                              <div><strong>Bank Name:</strong> {formData.bankName}</div>
                            </>
                        )}
                        {formData.aims && (
                            <div>
                              <strong>Aims & Objectives:</strong>
                              <p className="mt-1 text-gray-700 bg-white p-3 rounded border">{formData.aims}</p>
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Senior Treasurer */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Senior Treasurer</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Title:</strong> {formData.seniorTreasurer?.title}</div>
                        <div><strong>Name:</strong> {formData.seniorTreasurer?.name}</div>
                        <div><strong>Designation:</strong> {formData.seniorTreasurer?.designation}</div>
                        <div><strong>Department:</strong> {formData.seniorTreasurer?.department}</div>
                        <div><strong>Email:</strong> {formData.seniorTreasurer?.email}</div>
                        <div><strong>Mobile:</strong> {formData.seniorTreasurer?.mobile}</div>
                        <div className="md:col-span-2"><strong>Address:</strong> {formData.seniorTreasurer?.address}</div>
                      </div>
                    </div>

                    {/* Society Officials */}
                    <div className="bg-orange-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Society Officials</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { title: 'President', data: formData.president },
                          { title: 'Vice President', data: formData.vicePresident },
                          { title: 'Secretary', data: formData.secretary },
                          { title: 'Joint Secretary', data: formData.jointSecretary },
                          { title: 'Junior Treasurer', data: formData.juniorTreasurer },
                          { title: 'Editor', data: formData.editor }
                        ].map((official, index) => (
                            <div key={index} className="bg-white rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-2">{official.title}</h5>
                              <div className="text-sm space-y-1">
                                <div><strong>Reg No:</strong> {official.data?.regNo}</div>
                                <div><strong>Name:</strong> {official.data?.name}</div>
                                <div><strong>Email:</strong> {official.data?.email}</div>
                                <div><strong>Mobile:</strong> {official.data?.mobile}</div>
                                <div><strong>Address:</strong> {official.data?.address}</div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>

                    {/* Advisory Board */}
                    {formData.advisoryBoard && formData.advisoryBoard.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Advisory Board Members ({formData.advisoryBoard.length})</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {formData.advisoryBoard.map((member, index) => (
                                <div key={index} className="bg-white rounded-lg p-4">
                                  <div className="text-sm space-y-1">
                                    <div><strong>Name:</strong> {member.name}</div>
                                    <div><strong>Designation:</strong> {member.designation}</div>
                                    <div><strong>Department:</strong> {member.department}</div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {/* Committee Members */}
                    {formData.committeeMember && formData.committeeMember.length > 0 && (
                        <div className="bg-yellow-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Committee Members ({formData.committeeMember.length})</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            {formData.committeeMember.map((member, index) => (
                                <div key={index} className="bg-white rounded-lg p-3">
                                  <div className="text-sm">
                                    <div><strong>Reg No:</strong> {member.regNo}</div>
                                    <div><strong>Name:</strong> {member.name}</div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {/* General Members */}
                    {formData.member && formData.member.length > 0 && (
                        <div className="bg-emerald-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">General Members ({formData.member.length})</h4>
                          <div className="grid md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                            {formData.member.map((member, index) => (
                                <div key={index} className="bg-white rounded-lg p-3">
                                  <div className="text-xs">
                                    <div><strong>Reg No:</strong> {member.regNo}</div>
                                    <div><strong>Name:</strong> {member.name}</div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {/* Planning Events */}
                    {formData.planningEvents && formData.planningEvents.length > 0 && (
                        <div className="bg-pink-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Planning Events ({formData.planningEvents.length})</h4>
                          <div className="space-y-3">
                            {formData.planningEvents.map((event, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 flex justify-between items-center">
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-900">{event.activity}</div>
                                  </div>
                                  <div className="text-sm text-gray-600">{event.month}</div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <button
                      onClick={() => setShowPreview(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
              onClick={onPrev}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            <button
                onClick={() => setShowPreview(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Application</span>
            </button>

            <button
                onClick={handleDownloadPDF}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send for Approval</span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default ReviewStep;