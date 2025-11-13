// src/services/api.js
const API_BASE ="http://localhost:5000/api";

export const api = {
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Admin auth
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stats API failed:', error);
      throw error;
    }
  },

  // Get courses progress
  getCoursesProgress: async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/courses-progress`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Courses progress API failed:', error);
      throw error;
    }
  },

  // In api.js - Update the addCourse method
addCourse: async (courseKey, courseName, courseIcon) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/admin/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        key: courseKey,
        name: courseName,
        icon: courseIcon
      })
    });

    const text = await response.text();
    console.log('Add course response:', text);
    
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
},

  // Add day with topic and description
  addDay: async (course, day, dayData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/days`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course,
          day,
          ...dayData
        })
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Add questions to existing day
  addQuestions: async (course, day, questions) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/admin/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course,
          day,
          questions
        })
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Get quiz questions
  getQuiz: async (course, day) => {
    const response = await fetch(`${API_BASE}/quiz/${course}/${day}`);
    return response.json();
  },

  // Get all courses
  getCourses: async () => {
    try {
      const response = await fetch(`${API_BASE}/courses`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Courses API failed:', error);
      throw error;
    }
  },

  // Get course days
  getCourseDays: async (course) => {
    try {
      const response = await fetch(`${API_BASE}/course-days/${course}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch course days');
      }
      
      return data;
    } catch (error) {
      console.error('Course days API failed:', error);
      throw error;
    }
  },

  // Get topic detail
  getTopicDetail: async (course, day) => {
    try {
      const response = await fetch(`${API_BASE}/topic-detail/${course}/${day}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch topic detail');
      }
      
      return data;
    } catch (error) {
      console.error('Topic detail API failed:', error);
      throw error;
    }
  },


  // In your api.js file, update the addQuestions method:
addQuestions: async (course, day, questions, topic, description) => {
  try {
    const response = await fetch(`${API_BASE}/admin/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course,
        day,
        questions,
        topic,
        description
      })
    });

    console.log('Add questions response status:', response.status);
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
},

  // Get next available day
  getNextDay: async (course) => {
    const response = await fetch(`${API_BASE}/next-day/${course}`);
    return response.json();
  },

  // Add user
  addUser: async (userData) => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};
