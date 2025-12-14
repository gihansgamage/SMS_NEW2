import React, { useState } from 'react';
import { Mail, Filter, Send, Users, Search } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { validateEmail } from '../../utils/validation';
import EmailValidationIndicator from '../Common/EmailValidationIndicator';

const AdminCommunication: React.FC = () => {
  const { societies } = useData();
  const [selectedRole, setSelectedRole] = useState('all');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const extractContacts = () => {
    // Guard Clause: If societies data is not yet loaded or empty
    if (!societies) return [];

    const contacts: any[] = [];

    societies.forEach(society => {
      // Safe access using ?. and || fallback
      const president = society.president || { name: 'Unknown', email: '' };
      const secretary = society.secretary || { name: 'Unknown', email: '' };
      const seniorTreasurer = society.seniorTreasurer || { name: 'Unknown', email: '' };
      const juniorTreasurer = society.juniorTreasurer || { name: 'Unknown', email: '' };

      if (selectedRole === 'all' || selectedRole === 'president') {
        if (president.email) { // Only add if email exists
          contacts.push({
            name: president.name,
            email: president.email,
            role: 'President',
            society: society.societyName || 'Unknown Society'
          });
        }
      }
      if (selectedRole === 'all' || selectedRole === 'secretary') {
        if (secretary.email) {
          contacts.push({
            name: secretary.name,
            email: secretary.email,
            role: 'Secretary',
            society: society.societyName || 'Unknown Society'
          });
        }
      }
      if (selectedRole === 'all' || selectedRole === 'treasurer') {
        if (seniorTreasurer.email) {
          contacts.push({
            name: seniorTreasurer.name,
            email: seniorTreasurer.email,
            role: 'Senior Treasurer',
            society: society.societyName || 'Unknown Society'
          });
        }
        if (juniorTreasurer.email) {
          contacts.push({
            name: juniorTreasurer.name,
            email: juniorTreasurer.email,
            role: 'Junior Treasurer',
            society: society.societyName || 'Unknown Society'
          });
        }
      }
    });

    return contacts;
  };

  const allContacts = extractContacts();

  // Filter contacts based on search term (Safe string checks)
  const contacts = allContacts.filter(contact =>
      (contact.name || '').toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      (contact.society || '').toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      (contact.role || '').toLowerCase().includes(contactSearchTerm.toLowerCase())
  );

  // Validate all email addresses and identify invalid ones
  React.useEffect(() => {
    const invalid = contacts.filter(contact => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !contact.email || !emailRegex.test(contact.email);
    }).map(contact => contact.email);

    setInvalidEmails(invalid);
  }, [contacts]); // Removed `contacts` from dependency to prevent loop if contacts array ref changes, use JSON.stringify if needed or leave empty if static

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      // Only select contacts with valid emails
      const validContacts = contacts.filter(contact => !invalidEmails.includes(contact.email));
      setSelectedContacts(validContacts.map(contact => contact.email));
    }
  };

  const handleContactToggle = (email: string) => {
    if (invalidEmails.includes(email)) {
      alert('Cannot select contact with invalid email address');
      return;
    }

    setSelectedContacts(prev =>
        prev.includes(email)
            ? prev.filter(e => e !== email)
            : [...prev, email]
    );
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim() || selectedContacts.length === 0) {
      alert('Please fill in the subject, message, and select recipients');
      return;
    }

    // Final validation of selected email addresses
    const invalidSelected = selectedContacts.filter(email => invalidEmails.includes(email));
    if (invalidSelected.length > 0) {
      alert(`Cannot send to invalid email addresses: ${invalidSelected.join(', ')}`);
      return;
    }

    // Simulate email sending
    alert(`Email sent successfully to ${selectedContacts.length} recipients!`);
    setEmailSubject('');
    setEmailBody('');
    setSelectedContacts([]);
  };

  return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Communication Centre</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Selection */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Recipients</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="all">All Positions</option>
                    <option value="president">Presidents</option>
                    <option value="secretary">Secretaries</option>
                    <option value="treasurer">Treasurers</option>
                  </select>
                </div>
              </div>

              {/* Contact Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                      type="text"
                      placeholder="Search contacts by name, email, society, or role..."
                      value={contactSearchTerm}
                      onChange={(e) => setContactSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {contactSearchTerm && (
                    <div className="mt-2 text-sm text-gray-600">
                      Showing {contacts.length} of {allContacts.length} contacts
                    </div>
                )}
              </div>

              <div className="mb-4">
                <button
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {selectedContacts.length > 0 && selectedContacts.length === contacts.filter(c => !invalidEmails.includes(c.email)).length ? 'Deselect All' : 'Select All'} ({contacts.length})
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {contacts.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No contacts found.</p>
                ) : (
                    contacts.map((contact, index) => (
                        <label key={`${contact.email}-${index}`} className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            invalidEmails.includes(contact.email)
                                ? 'bg-red-50 hover:bg-red-100'
                                : 'hover:bg-white'
                        }`}>
                          <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact.email)}
                              onChange={() => handleContactToggle(contact.email)}
                              disabled={invalidEmails.includes(contact.email)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-600">{contact.role} - {contact.society}</div>
                            <div className={`text-xs ${
                                invalidEmails.includes(contact.email) ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <span>{contact.email}</span>
                              <EmailValidationIndicator
                                  email={contact.email}
                                  position={contact.role.toLowerCase().replace(' ', '_')}
                              />
                            </div>
                          </div>
                        </label>
                    ))
                )}
              </div>

              {invalidEmails.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-red-800">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email Validation Warning:</span>
                      <span>{invalidEmails.length} contact(s) have invalid email addresses and cannot receive emails</span>
                    </div>
                    <div className="mt-2 text-xs text-red-700">
                      Invalid emails will be automatically excluded from bulk communications to ensure delivery success.
                    </div>
                  </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-800">
                  <Users className="w-4 h-4" />
                  <span>{selectedContacts.length} valid recipients selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Composition */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Email</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Enter your message..."
                      rows={8}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600">
                    Recipients: {selectedContacts.length}
                  </div>
                  <button
                      onClick={handleSendEmail}
                      disabled={!emailSubject.trim() || !emailBody.trim() || selectedContacts.length === 0}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Quick Templates</h4>
              <div className="space-y-2">
                <button
                    onClick={() => {
                      setEmailSubject('Important Notice - Society Activities');
                      setEmailBody('Dear Society Members,\n\nWe hope this message finds you well.\n\n[Your message here]\n\nBest regards,\nStudent Service Division\nUniversity of Peradeniya');
                    }}
                    className="w-full text-left p-2 text-sm text-blue-600 hover:bg-white rounded-lg transition-colors"
                >
                  General Notice Template
                </button>
                <button
                    onClick={() => {
                      setEmailSubject('Urgent: Registration Renewal Required');
                      setEmailBody('Dear Society Officials,\n\nThis is a reminder that your society registration renewal is due.\n\nPlease submit your renewal application before the deadline.\n\nBest regards,\nStudent Service Division');
                    }}
                    className="w-full text-left p-2 text-sm text-blue-600 hover:bg-white rounded-lg transition-colors"
                >
                  Renewal Reminder Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminCommunication;