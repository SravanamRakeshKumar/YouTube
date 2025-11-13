// src/pages/Homepage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const courses = [
    { name: 'HTML', icon: 'fab fa-html5', color: 'from-orange-500 to-red-500', started: true },
    { name: 'CSS', icon: 'fab fa-css3-alt', color: 'from-blue-500 to-teal-500', started: true },
    { name: 'JavaScript', icon: 'fab fa-js', color: 'from-yellow-500 to-orange-500', started: true },
    { name: 'Python', icon: 'fab fa-python', color: 'from-green-500 to-blue-500', started: false },
    { name: 'Java', icon: 'fab fa-java', color: 'from-red-500 to-orange-500', started: false },
    { name: 'React', icon: 'fab fa-react', color: 'from-cyan-500 to-blue-500', started: false },
    { name: 'C Programming', icon: 'fas fa-code', color: 'from-gray-500 to-blue-500', started: false },
  ];

  const socialLinks = [
    { icon: 'fab fa-youtube', url: '#', color: 'hover:text-red-600' },
    { icon: 'fab fa-github', url: '#', color: 'hover:text-gray-800' },
    { icon: 'fab fa-instagram', url: '#', color: 'hover:text-pink-600' },
    { icon: 'fas fa-envelope', url: '#', color: 'hover:text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Not You
            </div>
            <div className="space-x-4">
              <Link to="/admin/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="w-72 h-72 mx-auto mb-6 rounded-full bg-white shadow-lg overflow-hidden">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Your Photo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4">Welcome to Why Not You</h1>
          <p className="text-xl mb-8 opacity-90">Learn Web Development Day by Day with Interactive Quizzes</p>
          <div className="flex justify-center space-x-4">
            <a href="#courses" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Start Learning
            </a>
            <a href="#contact" className="btn-primary bg-transparent border-2 border-white hover:bg-white hover:text-blue-600">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           
{courses.map((course, index) => (
  <div key={index} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
    <div className="p-6 text-center">
      <i className={`${course.icon} text-4xl mb-4 ${course.color.replace('from-', 'text-').split(' ')[0]}`}></i>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{course.name}</h3>
      {course.started ? (
        <Link 
          to={`/course-days/${course.name.toLowerCase()}`}
          className="btn-primary inline-block w-full"
        >
          Start
        </Link>
      ) : (
        <button className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-lg cursor-not-allowed">
          Coming Soon
        </button>
      )}
    </div>
  </div>
))}
        
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Get In Touch</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feedback Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Send Feedback</h3>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your feedback..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="btn-primary w-full">
                  Send Feedback
                </button>
              </div>
            </div>

            {/* Message Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Send Message</h3>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="btn-primary w-full">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-4">Why Not You</div>
              <p className="text-gray-400">Learn, Practice, Succeed</p>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className={`text-2xl text-gray-400 transition-colors ${link.color}`}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Why Not You. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;