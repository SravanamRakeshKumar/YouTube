// src/pages/TopicSelection.js
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TopicSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course = searchParams.get('course');

  const categories = [
    {
      name: 'Basic',
      icon: 'fas fa-seedling',
      color: 'from-green-500 to-emerald-600',
      description: 'Fundamental concepts and beginner level questions'
    },
    {
      name: 'Medium', 
      icon: 'fas fa-chart-line',
      color: 'from-blue-500 to-cyan-600',
      description: 'Intermediate level with practical applications'
    },
    {
      name: 'Advanced',
      icon: 'fas fa-rocket',
      color: 'from-purple-500 to-pink-600',
      description: 'Advanced concepts and complex scenarios'
    }
  ];

  const handleCategorySelect = (category) => {
    navigate(`/admin/topic-info?course=${course}&category=${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Select Topic Level</h1>
                <p className="text-gray-600">Course: <span className="font-semibold capitalize">{course}</span></p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategorySelect(category.name)}
              className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className={`h-3 bg-gradient-to-r ${category.color}`}></div>
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-3xl`}>
                  <i className={category.icon}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{category.name}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold inline-block`}>
                  Select {category.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;