import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, FileText, Search, TrendingUp, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

interface EventPermission {
  id: number;
  eventName: string;
  societyName: string;
  eventDate: string;
  timeFrom: string;
  timeTo: string;
  place: string;
  status: string;
}

interface Stats {
  activeSocieties: number;
  totalSocieties: number;
  currentYearRegistrations: number;
}

const HomePage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventPermission[]>([]);
  const [stats, setStats] = useState<Stats>({ activeSocieties: 0, totalSocieties: 0, currentYearRegistrations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, statsRes] = await Promise.all([
          apiService.events.getUpcoming(5),
          apiService.societies.getStatistics()
        ]);
        setUpcomingEvents(eventsRes.data || []);
        setStats(statsRes.data || { activeSocieties: 0, totalSocieties: 0, currentYearRegistrations: 0 });
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">

        {/* 1. Hero Section: Cover Text, Images, Statistics */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <svg
                  className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                  fill="currentColor"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">University of Peradeniya</span>{' '}
                    <span className="block text-blue-600 xl:inline">Society Management System</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Streamline your society operations. Register new societies, renew existing memberships, manage events, and discover the vibrant student community all in one place.
                  </p>

                  {/* Statistics integrated into Hero */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">{stats.activeSocieties} Active Societies</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-900">{upcomingEvents.length} Upcoming Events</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">{new Date().getFullYear()} Academic Year</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
                className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="University students"
            />
          </div>
        </div>

        {/* 2. Explore All Societies */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
              Discover Our Student Community
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Explore the diverse range of societies active within the university. Find your passion and get involved.
            </p>
            <Link
                to="/explore"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:text-lg transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore All Societies
            </Link>
          </div>
        </div>

        {/* 3. Upcoming Events */}
        {upcomingEvents.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                <Link to="/explore" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  View all <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="divide-y divide-gray-200">
                  {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                {new Date(event.eventDate).getDate()}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                              <p className="text-gray-600">{event.societyName}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-6">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(event.eventDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.timeFrom} - {event.timeTo}
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* 4. Main Functions */}
        <div className="bg-gray-100 py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Society Management Services</h2>
              <p className="mt-4 text-xl text-gray-600">Administrative tools for society officials</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* New Society Registration */}
              <Link to="/register" className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="w-24 h-24 text-blue-600" />
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">New Registration</h3>
                <p className="text-gray-600 mb-6">
                  Start a new chapter. Submit an application to register a new society at the university.
                </p>
                <span className="text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Start Registration <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>

              {/* Renewal Existing Society */}
              <Link to="/renewal" className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="w-24 h-24 text-green-600" />
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Society Renewal</h3>
                <p className="text-gray-600 mb-6">
                  Keep your society active. Submit annual renewal documentation for existing societies.
                </p>
                <span className="text-green-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Renew Now <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>

              {/* Request Event Permission */}
              <Link to="/events" className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="w-24 h-24 text-purple-600" />
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Event Permission</h3>
                <p className="text-gray-600 mb-6">
                  Plan your activities. Request official permission for society events and gatherings.
                </p>
                <span className="text-purple-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Request Permission <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>
  );
};

export default HomePage;