// src/pages/CourseDays.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const CourseDays = () => {
  const { course } = useParams();
  const [days, setDays] = useState([]);
  const [filteredDays, setFilteredDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadCourseData();
  }, [course]);

  useEffect(() => {
    // Filter days based on selected category
    if (selectedCategory === 'all') {
      setFilteredDays(days);
    } else {
      setFilteredDays(days.filter(day => day.category === selectedCategory));
    }
  }, [days, selectedCategory]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const daysData = await api.getCourseDays(course);
      
      console.log('Loaded days data:', daysData);
      
      if (daysData.success) {
        setDays(daysData.days || []);
        console.log("all days data is:",daysData.days)
        setFilteredDays(daysData.days || []);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      basic: 'bg-green-500',
      medium: 'bg-blue-500', 
      advanced: 'bg-purple-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  // Get unique categories and their counts
  const getCategoriesWithCounts = () => {
    const categoryCounts = {
      'all': days.length
    };
    
    days.forEach(day => {
      if (day.category) {
        categoryCounts[day.category] = (categoryCounts[day.category] || 0) + 1;
      }
    });

    return [
      { name: 'all', displayName: 'All Categories', count: categoryCounts.all },
      { name: 'basic', displayName: 'Basic', count: categoryCounts.basic || 0 },
      { name: 'medium', displayName: 'Medium', count: categoryCounts.medium || 0 },
      { name: 'advanced', displayName: 'Advanced', count: categoryCounts.advanced || 0 }
    ];
  };

  const categories = getCategoriesWithCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-xl text-gray-600">Loading course days...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">{course} Course Quizes</h1>
                <p className="text-gray-600">{filteredDays.length} days available</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="container mx-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category:</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.displayName} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Days Grid */}
      <div className="container mx-auto px-6 py-12">
        {filteredDays.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-folder-open text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedCategory === 'all' ? 'No Days Available' : `No ${selectedCategory} Days Available`}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? "This course doesn't have any quiz days yet." 
                : `No ${selectedCategory} level days available for this course.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDays.map((day, index) => (
              <div key={index} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 capitalize">{day.day.replace('-', ' ')}</h3>
                      <p className="text-sm text-gray-600">{day.quizesCount} quiz questions</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1">{day.topic}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{day.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* FIXED: Category display - using day.category from your JSON */}
                    {day.category && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryColor(day.category)} text-white`}>
                        {day.category}
                      </span>
                    )}
                    <Link 
                      to={`/topic-detail/${course}/${day.day}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDays;
