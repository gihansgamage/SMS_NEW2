import React, { useState } from 'react';
import { Search, Filter, Users, Globe, ExternalLink, School } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Society } from '../types';

const ExplorePage: React.FC = () => {
  const { societies, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter for Active Societies Only
  const activeSocieties = societies ? societies.filter(s => s.status === 'active') : [];

  const filteredSocieties = activeSocieties.filter(society => {
    const matchesSearch = society.societyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        society.president?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || society.registrationType === categoryFilter; // Assuming registrationType holds category
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Religious', 'Social'];

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Our Societies</h1>
            <p className="text-xl text-gray-600">Discover the vibrant student communities at the University of Peradeniya</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                  type="text"
                  placeholder="Search societies by name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-400" />
              {categories.map(cat => (
                  <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          categoryFilter === cat
                              ? 'bg-maroon-800 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {cat}
                  </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-800"></div>
                <p className="mt-2 text-gray-500">Loading societies...</p>
              </div>
          ) : filteredSocieties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSocieties.map((society) => (
                    <div key={society.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100">
                      <div className="h-32 bg-gradient-to-r from-maroon-800 to-maroon-600 p-6 flex items-center justify-center">
                        <School className="w-16 h-16 text-white opacity-20" />
                        <h3 className="text-xl font-bold text-white text-center relative z-10">{society.societyName}</h3>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Active
                    </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">President: {society.president?.name || 'Not Listed'}</span>
                          </div>
                          {society.website && (
                              <div className="flex items-center text-gray-700">
                                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                <a href={society.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                                  Visit Website
                                </a>
                              </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <button className="w-full flex items-center justify-center text-maroon-800 font-medium text-sm hover:text-maroon-900">
                            View Details <ExternalLink className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No societies found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default ExplorePage;