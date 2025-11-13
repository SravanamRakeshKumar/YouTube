// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_PATH = path.join(__dirname, 'database.json');

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

// Initialize database if not exists
const initializeDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      courses: {
        html: { 
          name: "HTML", 
          days: {
            "day-1": {
              "topic": "HTML Basics",
              "description": "Learn fundamental HTML tags and structure",
              "quizes": [
                {
                  "id": 1731417600000,
                  "question": "What does HTML stand for?",
                  "options": [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Hyper Transfer Markup Language",
                    "Home Tool Markup Language"
                  ],
                  "answer": 0,
                  "category": "basic",
                  "explanation": "HTML stands for Hyper Text Markup Language..."
                }
              ]
            },
            "day-2": {
              "topic": "HTML Forms",
              "description": "Learn about HTML form elements and attributes",
              "quizes": []
            }
          }
        },
        css: {
          name: "CSS", 
          days: {
            "day-1": {
              "topic": "CSS Basics",
              "description": "Learn fundamental CSS properties and selectors",
              "quizes": []
            }
          }
        }
      },
      users: [],
      admin: {
        username: "admin",
        password: "admin123"
      }
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    console.log('Database initialized successfully!');
  }
};

// Read database
const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
};

// Write to database
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// Initialize database on server start
initializeDB();

// Routes

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  if (username === db.admin.username && password === db.admin.password) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Get all courses
app.get('/api/courses', (req, res) => {
  const db = readDB();
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  res.json(db.courses);
});

// Get questions for specific course and day
app.get('/api/quiz/:course/:day', (req, res) => {
  const { course, day } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  if (db.courses[course] && db.courses[course].days[day]) {
    const dayData = db.courses[course].days[day];
    res.json({
      success: true,
      questions: dayData.quizes || [],
      course: db.courses[course].name,
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
});

// Get all days for a specific course
app.get('/api/course-days/:course', (req, res) => {
  const { course } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  if (!db.courses[course]) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  const daysData = Object.entries(db.courses[course].days).map(([day, dayData]) => ({
    day,
    topic: dayData.topic || 'No topic',
    description: dayData.description || 'No description',
    quizesCount: dayData.quizes ? dayData.quizes.length : 0,
    category: dayData.category
    // category: dayData.quizes && dayData.quizes.length > 0 ? dayData.quizes[0].category : null
  }));

  // Sort days by day number
  daysData.sort((a, b) => {
    const aNum = parseInt(a.day.replace('day-', ''));
    const bNum = parseInt(b.day.replace('day-', ''));
    return aNum - bNum;
  });

  res.json({
    success: true,
    course: db.courses[course].name,
    days: daysData,
    totalDays: daysData.length
  });
});

// Get topic detail
// In server.js - topic-detail endpoint
app.get('/api/topic-detail/:course/:day', (req, res) => {
  const { course, day } = req.params;
  const db = readDB();
  
  console.log('Fetching topic detail for:', { course, day }); // DEBUG LOG
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  if (!db.courses[course] || !db.courses[course].days[day]) {
    console.log('Topic not found in database'); // DEBUG LOG
    return res.status(404).json({ success: false, message: "Topic not found" });
  }

  const dayData = db.courses[course].days[day];
  const quizes = dayData.quizes || [];

  console.log('Found day data:', dayData); // DEBUG LOG
  
  const response = {
    success: true,
    course: db.courses[course].name,
    day: day,
    topic: dayData.topic,
    description: dayData.description,
    category: dayData.category || 'basic',
    quizes: quizes,
    quizesCount: quizes.length
  };
  
  console.log('Sending response:', response); // DEBUG LOG
  res.json(response);
});


// In server.js - Update the add course endpoint
app.post('/api/admin/courses', (req, res) => {
  const { key, name, icon } = req.body;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }

  if (!key || !name) {
    return res.status(400).json({ success: false, message: "Course key and name are required" });
  }

  // Check if course already exists
  if (db.courses[key]) {
    return res.status(400).json({ success: false, message: "Course already exists" });
  }

  // Add new course to database with empty days object
  db.courses[key] = {
    name: name,
    days: {}
  };

  if (writeDB(db)) {
    res.json({ 
      success: true, 
      message: `Course "${name}" added successfully`,
      courseKey: key
    });
  } else {
    res.status(500).json({ success: false, message: "Failed to save course" });
  }
});


// Update the add day endpoint in server.js
app.post('/api/admin/days', (req, res) => {
  const { course, day, topic, description, category, quizes = [] } = req.body; // Add category here
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  // Initialize course if not exists
  if (!db.courses[course]) {
    db.courses[course] = { 
      name: course.charAt(0).toUpperCase() + course.slice(1), 
      days: {} 
    };
  }
  
  // Add day data WITH category
  db.courses[course].days[day] = {
    topic,
    description,
    category: category || 'basic', // Default to basic if not provided
    quizes: quizes
  };
  
  if (writeDB(db)) {
    res.json({ 
      success: true, 
      message: `Added day ${day} to ${course}`,
      day: day
    });
  } else {
    res.status(500).json({ success: false, message: "Failed to save day" });
  }
});

// Update the add questions endpoint in server.js
app.post('/api/admin/questions', (req, res) => {
  const { course, day, questions } = req.body; // Remove topic, description, category from here
  const db = readDB();
  
  console.log('Received request to add questions:', { course, day, questionsCount: questions ? questions.length : 0 });
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  // Initialize course if not exists
  if (!db.courses[course]) {
    db.courses[course] = { 
      name: course.charAt(0).toUpperCase() + course.slice(1), 
      days: {} 
    };
  }
  
  // If day doesn't exist, create it with default values
  if (!db.courses[course].days[day]) {
    db.courses[course].days[day] = {
      topic: 'No topic',
      description: 'No description',
      category: 'basic', // Default category
      quizes: []
    };
  }
  
  // Add questions with IDs (without duplicate topic/description/category)
  const questionsWithIds = questions.map((q, index) => ({
    id: Date.now() + index,
    ...q
  }));
  
  // Initialize quizes array if not exists
  if (!db.courses[course].days[day].quizes) {
    db.courses[course].days[day].quizes = [];
  }
  
  // Add new questions to existing quizes
  db.courses[course].days[day].quizes = [
    ...db.courses[course].days[day].quizes,
    ...questionsWithIds
  ];
  
  if (writeDB(db)) {
    const response = { 
      success: true, 
      message: `Added ${questions.length} questions to ${course} - ${day}`,
      totalQuestions: db.courses[course].days[day].quizes.length
    };
    console.log('Success response:', response);
    res.json(response);
  } else {
    const errorResponse = { success: false, message: "Failed to save questions" };
    console.log('Error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

// Get next available day number for course
app.get('/api/next-day/:course', (req, res) => {
  const { course } = req.params;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  if (!db.courses[course]) {
    return res.json({ success: true, nextDay: 'day-1' });
  }

  const days = Object.keys(db.courses[course].days)
    .filter(day => day.startsWith('day-'))
    .map(day => parseInt(day.replace('day-', '')))
    .sort((a, b) => a - b);

  const nextDay = days.length > 0 ? Math.max(...days) + 1 : 1;
  
  res.json({
    success: true,
    nextDay: `day-${nextDay}`,
    existingDays: days
  });
});

// Get dashboard stats
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  let totalDays = 0;
  let startedCourses = 0;
  let totalQuestions = 0;

  Object.values(db.courses).forEach(course => {
    const courseDays = Object.keys(course.days).length;
    totalDays += courseDays;
    if (courseDays > 0) {
      startedCourses++;
    }
    // Count total questions
    Object.values(course.days).forEach(dayData => {
      totalQuestions += dayData.quizes ? dayData.quizes.length : 0;
    });
  });
  
  const stats = {
    totalCourses: Object.keys(db.courses).length,
    startedCourses: startedCourses,
    totalDays: totalDays,
    totalQuestions: totalQuestions,
    totalUsers: db.users.length
  };
  
  res.json(stats);
});

// Get course progress for admin dashboard
app.get('/api/admin/courses-progress', (req, res) => {
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }
  
  const coursesProgress = Object.entries(db.courses).map(([key, course]) => {
    const totalDays = Object.keys(course.days).length;

    return {
      name: course.name,
      value: key,
      days: totalDays,
      progress: Math.min((totalDays / 30) * 100, 100),
      icon: getCourseIcon(key),
      color: getCourseColor(key)
    };
  });
  
  res.json(coursesProgress);
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const db = readDB();
  
  if (!db) {
    return res.status(500).json({ success: false, message: "Database error" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    joinedAt: new Date().toISOString(),
    completedQuizzes: []
  };

  db.users.push(newUser);
  
  if (writeDB(db)) {
    res.json({ success: true, user: newUser });
  } else {
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!', 
    timestamp: new Date().toISOString() 
  });
});

// module.exports = app;

// Start server
// if (require.main === module) {
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Add questions endpoint: POST http://localhost:${PORT}/api/admin/questions`);
});
// }