// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = require('./config/database');
connectDB();

// Models
const Course = require('./models/Course');
const User = require('./models/User');
const Admin = require('./models/Admin');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
function getCourseIcon(course) {
  const icons = {
    html: 'fab fa-html5',
    css: 'fab fa-css3-alt',
    javascript: 'fab fa-js',
    python: 'fab fa-python',
    java: 'fab fa-java',
    react: 'fab fa-react',
    c: 'fas fa-code'
  };
  return icons[course] || 'fas fa-book';
}

function getCourseColor(course) {
  const colors = {
    html: 'from-orange-500 to-red-500',
    css: 'from-blue-500 to-teal-500',
    javascript: 'from-yellow-500 to-orange-500',
    python: 'from-green-500 to-blue-500',
    java: 'from-red-500 to-orange-500',
    react: 'from-cyan-500 to-blue-500',
    c: 'from-gray-500 to-blue-500'
  };
  return colors[course] || 'from-gray-500 to-blue-500';
}

// Routes

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (admin && password === admin.password) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    const coursesObject = {};
    courses.forEach(course => {
      coursesObject[course.key] = {
        name: course.name,
        days: course.days.reduce((acc, day) => {
          acc[day.day] = {
            topic: day.topic,
            description: day.description,
            quizes: day.quizes
          };
          return acc;
        }, {})
      };
    });
    res.json(coursesObject);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Get questions for specific course and day
app.get('/api/quiz/:course/:day', async (req, res) => {
  try {
    const { course, day } = req.params;
    const courseData = await Course.findOne({ key: course });
    
    if (!courseData) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
    
    const dayData = courseData.days.find(d => d.day === day);
    
    if (dayData) {
      res.json({
        success: true,
        questions: dayData.quizes || [],
        course: courseData.name,
        day: day,
        topic: dayData.topic,
        description: dayData.description
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Quiz not found for this course and day" 
      });
    }
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Get all days for a specific course
app.get('/api/course-days/:course', async (req, res) => {
  try {
    const { course } = req.params;
    const courseData = await Course.findOne({ key: course });
    
    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const daysData = courseData.days.map(day => ({
      day: day.day,
      topic: day.topic || 'No topic',
      description: day.description || 'No description',
      quizesCount: day.quizes ? day.quizes.length : 0,
      category: day.category
    }));

    // Sort days by day number
    daysData.sort((a, b) => {
      const aNum = parseInt(a.day.replace('day-', ''));
      const bNum = parseInt(b.day.replace('day-', ''));
      return aNum - bNum;
    });

    res.json({
      success: true,
      course: courseData.name,
      days: daysData,
      totalDays: daysData.length
    });
  } catch (error) {
    console.error('Get course days error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Get topic detail
app.get('/api/topic-detail/:course/:day', async (req, res) => {
  try {
    const { course, day } = req.params;
    const courseData = await Course.findOne({ key: course });
    
    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    
    const dayData = courseData.days.find(d => d.day === day);
    
    if (!dayData) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    const quizes = dayData.quizes || [];
    
    const response = {
      success: true,
      course: courseData.name,
      day: day,
      topic: dayData.topic,
      description: dayData.description,
      category: dayData.category || 'basic',
      quizes: quizes,
      quizesCount: quizes.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Get topic detail error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Add new course
app.post('/api/admin/courses', async (req, res) => {
  try {
    const { key, name, icon } = req.body;
    
    if (!key || !name) {
      return res.status(400).json({ success: false, message: "Course key and name are required" });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ key });
    if (existingCourse) {
      return res.status(400).json({ success: false, message: "Course already exists" });
    }

    // Create new course
    const newCourse = new Course({
      key,
      name,
      days: []
    });

    await newCourse.save();

    res.json({ 
      success: true, 
      message: `Course "${name}" added successfully`,
      courseKey: key
    });
  } catch (error) {
    console.error('Add course error:', error);
    res.status(500).json({ success: false, message: "Failed to save course" });
  }
});

// Add new day to course
app.post('/api/admin/days', async (req, res) => {
  try {
    const { course, day, topic, description, category, quizes = [] } = req.body;
    
    const courseData = await Course.findOne({ key: course });
    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if day already exists
    const existingDay = courseData.days.find(d => d.day === day);
    if (existingDay) {
      return res.status(400).json({ success: false, message: "Day already exists" });
    }

    // Add new day
    courseData.days.push({
      day,
      topic,
      description,
      category: category || 'basic',
      quizes: quizes
    });

    await courseData.save();

    res.json({ 
      success: true, 
      message: `Added day ${day} to ${course}`,
      day: day
    });
  } catch (error) {
    console.error('Add day error:', error);
    res.status(500).json({ success: false, message: "Failed to save day" });
  }
});

// Add questions to course day
app.post('/api/admin/questions', async (req, res) => {
  try {
    const { course, day, questions } = req.body;
    
    let courseData = await Course.findOne({ key: course });
    
    // Create course if not exists
    if (!courseData) {
      courseData = new Course({
        key: course,
        name: course.charAt(0).toUpperCase() + course.slice(1),
        days: []
      });
    }
    
    // Find or create day
    let dayData = courseData.days.find(d => d.day === day);
    if (!dayData) {
      dayData = {
        day,
        topic: 'No topic',
        description: 'No description',
        category: 'basic',
        quizes: []
      };
      courseData.days.push(dayData);
    }
    
    // Add questions with IDs
    const questionsWithIds = questions.map((q, index) => ({
      id: Date.now() + index,
      ...q
    }));
    
    // Add new questions to existing quizes
    dayData.quizes = [
      ...dayData.quizes,
      ...questionsWithIds
    ];
    
    await courseData.save();

    const response = { 
      success: true, 
      message: `Added ${questions.length} questions to ${course} - ${day}`,
      totalQuestions: dayData.quizes.length
    };
    
    res.json(response);
  } catch (error) {
    console.error('Add questions error:', error);
    res.status(500).json({ success: false, message: "Failed to save questions" });
  }
});

// Get next available day number for course
app.get('/api/next-day/:course', async (req, res) => {
  try {
    const { course } = req.params;
    const courseData = await Course.findOne({ key: course });
    
    if (!courseData) {
      return res.json({ success: true, nextDay: 'day-1' });
    }

    const days = courseData.days
      .filter(day => day.day.startsWith('day-'))
      .map(day => parseInt(day.day.replace('day-', '')))
      .sort((a, b) => a - b);

    const nextDay = days.length > 0 ? Math.max(...days) + 1 : 1;
    
    res.json({
      success: true,
      nextDay: `day-${nextDay}`,
      existingDays: days
    });
  } catch (error) {
    console.error('Get next day error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Get dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const courses = await Course.find({});
    const users = await User.find({});
    
    let totalDays = 0;
    let startedCourses = 0;
    let totalQuestions = 0;

    courses.forEach(course => {
      const courseDays = course.days.length;
      totalDays += courseDays;
      if (courseDays > 0) {
        startedCourses++;
      }
      // Count total questions
      course.days.forEach(dayData => {
        totalQuestions += dayData.quizes ? dayData.quizes.length : 0;
      });
    });
    
    const stats = {
      totalCourses: courses.length,
      startedCourses: startedCourses,
      totalDays: totalDays,
      totalQuestions: totalQuestions,
      totalUsers: users.length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Get course progress for admin dashboard
app.get('/api/admin/courses-progress', async (req, res) => {
  try {
    const courses = await Course.find({});
    
    const coursesProgress = courses.map(course => {
      const totalDays = course.days.length;

      return {
        name: course.name,
        value: course.key,
        days: totalDays,
        progress: Math.min((totalDays / 30) * 100, 100),
        icon: getCourseIcon(course.key),
        color: getCourseColor(course.key)
      };
    });
    
    res.json(coursesProgress);
  } catch (error) {
    console.error('Get courses progress error:', error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const newUser = new User({
      name,
      email,
      completedQuizzes: []
    });

    await newUser.save();
    
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start the server
const startServer = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
};

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;







































































// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// const connectDB = require('./config/database');
// connectDB();

// // Models
// const Course = require('./models/Course');
// const User = require('./models/User');
// const Admin = require('./models/Admin');

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Helper functions
// function getCourseIcon(course) {
//   const icons = {
//     html: 'fab fa-html5',
//     css: 'fab fa-css3-alt',
//     javascript: 'fab fa-js',
//     python: 'fab fa-python',
//     java: 'fab fa-java',
//     react: 'fab fa-react',
//     c: 'fas fa-code'
//   };
//   return icons[course] || 'fas fa-book';
// }

// function getCourseColor(course) {
//   const colors = {
//     html: 'from-orange-500 to-red-500',
//     css: 'from-blue-500 to-teal-500',
//     javascript: 'from-yellow-500 to-orange-500',
//     python: 'from-green-500 to-blue-500',
//     java: 'from-red-500 to-orange-500',
//     react: 'from-cyan-500 to-blue-500',
//     c: 'from-gray-500 to-blue-500'
//   };
//   return colors[course] || 'from-gray-500 to-blue-500';
// }

// // Routes

// // Admin Login
// app.post('/api/admin/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const admin = await Admin.findOne({ username });
    
//     if (admin && password === admin.password) {
//       res.json({ success: true, message: "Login successful" });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error('Admin login error:', error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Get all courses
// app.get('/api/courses', async (req, res) => {
//   try {
//     const courses = await Course.find({});
//     const coursesObject = {};
//     courses.forEach(course => {
//       coursesObject[course.key] = {
//         name: course.name,
//         days: course.days.reduce((acc, day) => {
//           acc[day.day] = {
//             topic: day.topic,
//             description: day.description,
//             quizes: day.quizes
//           };
//           return acc;
//         }, {})
//       };
//     });
//     res.json(coursesObject);
//   } catch (error) {
//     console.error('Get courses error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Get questions for specific course and day
// app.get('/api/quiz/:course/:day', async (req, res) => {
//   try {
//     const { course, day } = req.params;
//     const courseData = await Course.findOne({ key: course });
    
//     if (!courseData) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Course not found" 
//       });
//     }
    
//     const dayData = courseData.days.find(d => d.day === day);
    
//     if (dayData) {
//       res.json({
//         success: true,
//         questions: dayData.quizes || [],
//         course: courseData.name,
//         day: day,
//         topic: dayData.topic,
//         description: dayData.description
//       });
//     } else {
//       res.status(404).json({ 
//         success: false, 
//         message: "Quiz not found for this course and day" 
//       });
//     }
//   } catch (error) {
//     console.error('Get quiz error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Get all days for a specific course
// app.get('/api/course-days/:course', async (req, res) => {
//   try {
//     const { course } = req.params;
//     const courseData = await Course.findOne({ key: course });
    
//     if (!courseData) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     const daysData = courseData.days.map(day => ({
//       day: day.day,
//       topic: day.topic || 'No topic',
//       description: day.description || 'No description',
//       quizesCount: day.quizes ? day.quizes.length : 0,
//       category: day.category
//     }));

//     // Sort days by day number
//     daysData.sort((a, b) => {
//       const aNum = parseInt(a.day.replace('day-', ''));
//       const bNum = parseInt(b.day.replace('day-', ''));
//       return aNum - bNum;
//     });

//     res.json({
//       success: true,
//       course: courseData.name,
//       days: daysData,
//       totalDays: daysData.length
//     });
//   } catch (error) {
//     console.error('Get course days error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Get topic detail
// app.get('/api/topic-detail/:course/:day', async (req, res) => {
//   try {
//     const { course, day } = req.params;
//     const courseData = await Course.findOne({ key: course });
    
//     if (!courseData) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }
    
//     const dayData = courseData.days.find(d => d.day === day);
    
//     if (!dayData) {
//       return res.status(404).json({ success: false, message: "Topic not found" });
//     }

//     const quizes = dayData.quizes || [];
    
//     const response = {
//       success: true,
//       course: courseData.name,
//       day: day,
//       topic: dayData.topic,
//       description: dayData.description,
//       category: dayData.category || 'basic',
//       quizes: quizes,
//       quizesCount: quizes.length
//     };
    
//     res.json(response);
//   } catch (error) {
//     console.error('Get topic detail error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Add new course
// app.post('/api/admin/courses', async (req, res) => {
//   try {
//     const { key, name, icon } = req.body;
    
//     if (!key || !name) {
//       return res.status(400).json({ success: false, message: "Course key and name are required" });
//     }

//     // Check if course already exists
//     const existingCourse = await Course.findOne({ key });
//     if (existingCourse) {
//       return res.status(400).json({ success: false, message: "Course already exists" });
//     }

//     // Create new course
//     const newCourse = new Course({
//       key,
//       name,
//       days: []
//     });

//     await newCourse.save();

//     res.json({ 
//       success: true, 
//       message: `Course "${name}" added successfully`,
//       courseKey: key
//     });
//   } catch (error) {
//     console.error('Add course error:', error);
//     res.status(500).json({ success: false, message: "Failed to save course" });
//   }
// });

// // Add new day to course
// app.post('/api/admin/days', async (req, res) => {
//   try {
//     const { course, day, topic, description, category, quizes = [] } = req.body;
    
//     const courseData = await Course.findOne({ key: course });
//     if (!courseData) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     // Check if day already exists
//     const existingDay = courseData.days.find(d => d.day === day);
//     if (existingDay) {
//       return res.status(400).json({ success: false, message: "Day already exists" });
//     }

//     // Add new day
//     courseData.days.push({
//       day,
//       topic,
//       description,
//       category: category || 'basic',
//       quizes: quizes
//     });

//     await courseData.save();

//     res.json({ 
//       success: true, 
//       message: `Added day ${day} to ${course}`,
//       day: day
//     });
//   } catch (error) {
//     console.error('Add day error:', error);
//     res.status(500).json({ success: false, message: "Failed to save day" });
//   }
// });

// // Add questions to course day
// app.post('/api/admin/questions', async (req, res) => {
//   try {
//     const { course, day, questions } = req.body;
    
//     let courseData = await Course.findOne({ key: course });
    
//     // Create course if not exists
//     if (!courseData) {
//       courseData = new Course({
//         key: course,
//         name: course.charAt(0).toUpperCase() + course.slice(1),
//         days: []
//       });
//     }
    
//     // Find or create day
//     let dayData = courseData.days.find(d => d.day === day);
//     if (!dayData) {
//       dayData = {
//         day,
//         topic: 'No topic',
//         description: 'No description',
//         category: 'basic',
//         quizes: []
//       };
//       courseData.days.push(dayData);
//     }
    
//     // Add questions with IDs
//     const questionsWithIds = questions.map((q, index) => ({
//       id: Date.now() + index,
//       ...q
//     }));
    
//     // Add new questions to existing quizes
//     dayData.quizes = [
//       ...dayData.quizes,
//       ...questionsWithIds
//     ];
    
//     await courseData.save();

//     const response = { 
//       success: true, 
//       message: `Added ${questions.length} questions to ${course} - ${day}`,
//       totalQuestions: dayData.quizes.length
//     };
    
//     res.json(response);
//   } catch (error) {
//     console.error('Add questions error:', error);
//     res.status(500).json({ success: false, message: "Failed to save questions" });
//   }
// });

// // Get next available day number for course
// app.get('/api/next-day/:course', async (req, res) => {
//   try {
//     const { course } = req.params;
//     const courseData = await Course.findOne({ key: course });
    
//     if (!courseData) {
//       return res.json({ success: true, nextDay: 'day-1' });
//     }

//     const days = courseData.days
//       .filter(day => day.day.startsWith('day-'))
//       .map(day => parseInt(day.day.replace('day-', '')))
//       .sort((a, b) => a - b);

//     const nextDay = days.length > 0 ? Math.max(...days) + 1 : 1;
    
//     res.json({
//       success: true,
//       nextDay: `day-${nextDay}`,
//       existingDays: days
//     });
//   } catch (error) {
//     console.error('Get next day error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Get dashboard stats
// app.get('/api/admin/stats', async (req, res) => {
//   try {
//     const courses = await Course.find({});
//     const users = await User.find({});
    
//     let totalDays = 0;
//     let startedCourses = 0;
//     let totalQuestions = 0;

//     courses.forEach(course => {
//       const courseDays = course.days.length;
//       totalDays += courseDays;
//       if (courseDays > 0) {
//         startedCourses++;
//       }
//       // Count total questions
//       course.days.forEach(dayData => {
//         totalQuestions += dayData.quizes ? dayData.quizes.length : 0;
//       });
//     });
    
//     const stats = {
//       totalCourses: courses.length,
//       startedCourses: startedCourses,
//       totalDays: totalDays,
//       totalQuestions: totalQuestions,
//       totalUsers: users.length
//     };
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Get stats error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Get course progress for admin dashboard
// app.get('/api/admin/courses-progress', async (req, res) => {
//   try {
//     const courses = await Course.find({});
    
//     const coursesProgress = courses.map(course => {
//       const totalDays = course.days.length;

//       return {
//         name: course.name,
//         value: course.key,
//         days: totalDays,
//         progress: Math.min((totalDays / 30) * 100, 100),
//         icon: getCourseIcon(course.key),
//         color: getCourseColor(course.key)
//       };
//     });
    
//     res.json(coursesProgress);
//   } catch (error) {
//     console.error('Get courses progress error:', error);
//     res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// // Add a new user
// app.post('/api/users', async (req, res) => {
//   try {
//     const { name, email } = req.body;
    
//     const newUser = new User({
//       name,
//       email,
//       completedQuizzes: []
//     });

//     await newUser.save();
    
//     res.json({ success: true, user: newUser });
//   } catch (error) {
//     console.error('Add user error:', error);
//     res.status(500).json({ success: false, message: "Failed to add user" });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'Server is running!', 
//     timestamp: new Date().toISOString(),
//     database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
//   });
// });

// module.exports = app;