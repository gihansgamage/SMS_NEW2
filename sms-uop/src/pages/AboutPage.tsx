import React from 'react';
import { Target, Users, Shield, Globe, Award, BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* 1. Hero Section - Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">SMS</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering the student community of the University of Peradeniya through
            efficient, transparent, and digital society management.
          </p>
        </div>
      </div>

      {/* 2. Mission & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To streamline the administrative processes of university societies,
              making it easier for students to organize events, manage memberships,
              and focus on their core objectives rather than paperwork.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To create a fully digitized, vibrant, and interconnected university community
              where every society thrives and every student has easy access to extracurricular opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* 3. What We Offer (Features) */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why use the System?</h2>
            <p className="text-gray-600 mt-4">Built specifically for the needs of UOP students and administration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">
                Clear processes for society registration and event approvals, visible to admins and student leaders.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                A central hub connecting the Student Services Division with all university societies.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Keeping</h3>
              <p className="text-gray-600">
                Digital archives of past events, society renewals, and office bearers for future reference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer / Contact Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <Award className="w-12 h-12 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl font-bold mb-4">Part of the University of Peradeniya</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            This system is managed by the Student Services Division to ensure the highest quality of student life on campus.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;