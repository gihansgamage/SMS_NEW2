import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, FileText, Settings, ChevronDown, ChevronUp, MessageCircle, AlertTriangle } from 'lucide-react';

const HelpPage: React.FC = () => {
  // State to handle which FAQ is currently open
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ Data List
  const faqs = [
    {
      question: "How do I register a new society?",
      answer: "Navigate to the 'Register Society' page from the dashboard. Fill in the required details including the society name, motto, and office bearers. Once submitted, your application will be reviewed by the Senior Treasurer."
    },
    {
      question: "My login is not working, what should I do?",
      answer: "First, ensure you are using your official university email. If you have forgotten your password, please contact the Student Services Division directly or use the 'Forgot Password' link on the admin login page."
    },
    {
      question: "How long does event approval take?",
      answer: "Event requests must be submitted at least 14 days in advance. The approval process typically takes 3-5 working days, depending on the availability of the Proctor and Senior Treasurer."
    },
    {
      question: "Can I edit my society details after registration?",
      answer: "Major details like Society Name cannot be changed easily. However, you can update your logo and current office bearers through the 'Renewal' page at the start of the academic year."
    },
    {
      question: "Where can I find the budget format?",
      answer: "Go to the 'Guidelines' page. Scroll down to the bottom 'Downloads' section, and you will find the standard Excel format for budget submissions."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. Hero Search Section */}
      <div className="bg-blue-600 pb-24 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 text-blue-200 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-6">How can we help you?</h1>


        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">

        {/* 2. Quick Help Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900">Registration Guide</h3>
            <p className="text-gray-600 text-sm mt-2">Step-by-step documentation on how to register and renew.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">Account Settings</h3>
            <p className="text-gray-600 text-sm mt-2">Manage your admin profile, password, and notifications.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Report an Issue</h3>
            <p className="text-gray-600 text-sm mt-2">Facing a bug? Let our technical team know immediately.</p>
          </div>
        </div>

        {/* 3. FAQ Accordion Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions about the SMS portal.</p>
          </div>

          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className={`font-medium ${openIndex === index ? 'text-blue-600' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>

                {/* Answer Dropdown */}
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-blue-100">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>



      </div>
    </div>
  );
};

export default HelpPage;