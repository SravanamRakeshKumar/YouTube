
// src/pages/TopicDetail.js (Fixed)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Footer from '../components/footer';

const TopicDetail = () => {
  const { course, day } = useParams();
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTopicData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getTopicDetail(course, day);
      
      console.log('Topic detail data:', data);
      
      if (data.success) {
        setTopicData(data);
      } else {
        console.error('Failed to load topic data:', data.message);
      }
    } catch (error) {
      console.error('Error loading topic data:', error);
    } finally {
      setLoading(false);
    }
  }, [course, day]);

  useEffect(() => {
    loadTopicData();
  }, [loadTopicData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-xl text-gray-600">Loading topic details...</p>
        </div>
      </div>
    );
  }

  // Rest of the code remains the same..

  if (!topicData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Topic Not Found</h2>
          <p className="text-gray-600 mb-6">The requested topic could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {course} {day.replace('-', ' ')}
                </h1>
                <p className="text-gray-600">Topic Details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 break-all">{topicData.topic}</h2>
            {/* <p className="text-lg text-gray-600 mb-6">{topicData.description}</p> */}
            <p className="text-lg text-gray-600 mb-6 whitespace-pre-line break-all">{topicData.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {topicData.category && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  topicData.category === 'basic' ? 'bg-green-500' :
                  topicData.category === 'medium' ? 'bg-blue-500' :
                  'bg-purple-500'
                } text-white`}>
                  {topicData.category}
                </span>
              )}
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quiz Questions</h3>
            
            {topicData.quizesCount > 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  This topic has {topicData.quizesCount} quiz question{topicData.quizesCount !== 1 ? 's' : ''} ready for you.
                </p>
                <Link 
                  to={`/quiz/${course}/${day}`}
                  className="btn-primary text-lg py-3 px-8"
                >
                  <i className="fas fa-play mr-2"></i>
                  Start Quiz
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-clipboard-list text-6xl text-gray-400 mb-4"></i>
                <h4 className="text-xl font-bold text-gray-800 mb-2">No Quiz Available</h4>
                <p className="text-gray-600 mb-6">
                  This topic doesn't have any quiz questions yet.
                </p>
                {/* <button
                  onClick={() => navigate('/admin/login')}
                  className="btn-primary"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Quiz Questions (Admin)
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default TopicDetail;