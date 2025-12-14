import React from 'react';
import { Book, FileText, DollarSign, Calendar, Users, AlertCircle, Download, CheckCircle } from 'lucide-react';

const GuidelinesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Society Guidelines & Constitution</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read the following regulations carefully. All registered societies at the
            University of Peradeniya are required to adhere to these by-laws.
          </p>
        </div>
      </div>

      {/* 2. Important Notice Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start">
          <AlertCircle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-amber-800">Annual Renewal Required</h3>
            <p className="text-amber-700 mt-1">
              Every society must renew their registration at the beginning of the academic year.
              Failure to renew within the first month will result in temporary suspension.
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Registration Process (Timeline) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Registration Process</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Submit Request', desc: 'Fill out the online application form via this system.' },
            { step: '02', title: 'Senior Treasurer', desc: 'Get approval signature from your Senior Treasurer.' },
            { step: '03', title: 'Proctor Review', desc: 'Application is reviewed by the Proctor/Student Services.' },
            { step: '04', title: 'Final Approval', desc: 'Once approved, you will receive your login credentials.' }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <span className="text-6xl font-bold text-gray-100 absolute -right-4 -top-4">{item.step}</span>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Core Regulations (Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">General Regulations</h2>
        <div className="grid md:grid-cols-2 gap-6">

          {/* Financial Rules */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Financial Management</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>All funds must be deposited in the official university bank account.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Budget reports must be submitted after every major event.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Annual audits are mandatory before renewal.</span>
              </li>
            </ul>
          </div>

          {/* Event Rules */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Event Protocols</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                <span>Event permission requests must be submitted 14 days in advance.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                <span>Faculty premises can only be used after 4:00 PM on weekdays.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0" />
                <span>Noise levels must be monitored to strictly avoid disturbing lectures.</span>
              </li>
            </ul>
          </div>

          {/* Membership Rules */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Membership & Leadership</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Office bearers must maintain a minimum GPA of 2.5.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Only full-time undergraduates are eligible for voting rights.</span>
              </li>
            </ul>
          </div>

          {/* Conduct Rules */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mr-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Code of Conduct</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span>Strict zero-tolerance policy on ragging or harassment.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span>Societies cannot be used for political campaigning.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>




    </div>
  );
};

export default GuidelinesPage;