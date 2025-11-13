// src/pages/TopicInfo.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

const TopicInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course = searchParams.get('course');
  const category = searchParams.get('category');
  
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [loading, setLoading] = useState(false);


  // In TopicInfo.js - update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!topicName.trim() || !topicDescription.trim()) {
    alert('Please fill in both topic name and description');
    return;
  }
  
  setLoading(true);
  
  try {
    // Create day with topic and description only (empty quizes array)
    const nextDayData = await api.getNextDay(course);
    const day = nextDayData.nextDay;
    
    // Add the day with topic and description AND category
    const result = await api.addDay(course, day, {
      topic: topicName,
      description: topicDescription,
      category: category, // Add category here
      quizes: []
    });
    
    if (result.success) {
      alert('Topic added successfully!');
      navigate(`/admin/topic-selection?course=${course}`);
    } else {
      alert('Failed to add topic: ' + result.message);
    }
  } catch (error) {
    console.error('Error adding topic:', error);
    alert('Error adding topic');
  } finally {
    setLoading(false);
  }
};

  const handleAddWithQuestions = () => {
    if (!topicName.trim() || !topicDescription.trim()) {
      alert('Please fill in both topic name and description');
      return;
    }
    
    // Navigate to add questions page
    navigate(`/admin/add-questions?course=${course}&category=${category}&topic=${encodeURIComponent(topicName)}&description=${encodeURIComponent(topicDescription)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Topic Information</h1>
                <p className="text-gray-600">
                  Course: <span className="font-semibold capitalize">{course}</span> | 
                  Level: <span className="font-semibold capitalize">{category}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Enter Topic Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Name *
                </label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g., HTML Basics, CSS Flexbox, JavaScript Functions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Topic Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Description *
                </label>
                <textarea
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  placeholder="Describe what this topic covers..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors text-lg font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Add Topic Only
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleAddWithQuestions}
                  className="flex-1 btn-primary text-lg py-3 px-6"
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Add with Quiz Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInfo;
