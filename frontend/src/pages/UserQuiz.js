// src/pages/UserQuiz.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const UserQuiz = () => {

     const { course, day } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


 useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await api.getQuiz(course, day);
        if (result.success) {
          setQuestions(result.questions);
        } else {
          setError(result.message || 'Quiz not found');
        }
      } catch (err) {
        setError('Failed to load quiz. Please check your connection.');
        console.error('Quiz load error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (course && day) {
      loadQuiz();
    }
  }, [course, day]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-xl text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="btn-primary">
            <i className="fas fa-home mr-2"></i>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }



  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <i className="fas fa-graduation-cap text-6xl text-blue-500 mb-6"></i>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {course?.toUpperCase()} - {day?.replace('-', ' ').toUpperCase()}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your knowledge with this interactive quiz. Each question has 4 options, and you'll get explanations for each answer!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <i className="fas fa-question-circle text-blue-500 text-2xl mb-2"></i>
                <p className="font-semibold text-gray-800">{questions.length} Questions</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <i className="fas fa-clock text-green-500 text-2xl mb-2"></i>
                <p className="font-semibold text-gray-800">Untimed</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <i className="fas fa-lightbulb text-purple-500 text-2xl mb-2"></i>
                <p className="font-semibold text-gray-800">With Explanations</p>
              </div>
            </div>
            <button
              onClick={() => setQuizStarted(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              <i className="fas fa-play mr-2"></i>
              Start Quiz
            </button>
            <div className="mt-6">
              <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}/{questions.length}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mt-4">
                {percentage >= 70 ? '🎉 Excellent!' : percentage >= 50 ? '👍 Good Job!' : '💪 Keep Learning!'}
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                You scored {score} out of {questions.length} questions correctly.
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {index + 1}. {question.question}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedAnswers[index] === question.answer
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAnswers[index] === question.answer ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border-2 ${
                          optIndex === question.answer
                            ? 'border-green-500 bg-green-50 text-green-800 font-bold'
                            : selectedAnswers[index] === optIndex
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                        {option}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowExplanation(showExplanation === index ? null : index)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <i className="fas fa-info-circle mr-2"></i>
                    {showExplanation === index ? 'Hide Explanation' : 'Know why answer is correct'}
                  </button>

                  {showExplanation === index && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <i className="fas fa-lightbulb text-blue-500 text-xl mr-3 mt-1"></i>
                        <p className="text-blue-800">{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8 space-y-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setQuizStarted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                }}
                className="btn-primary mr-4"
              >
                <i className="fas fa-redo mr-2"></i>
                Retake Quiz
              </button>
              <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-xl text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {course?.toUpperCase()} - {day?.replace('-', ' ').toUpperCase()}
              </h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuestion + 1}. {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              Submit Quiz
              <i className="fas fa-paper-plane ml-2"></i>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              Next Question
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuiz;