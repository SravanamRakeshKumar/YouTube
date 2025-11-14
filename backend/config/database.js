const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize default data
    await initializeDefaultData();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

const initializeDefaultData = async () => {
  try {
    const Admin = require('../models/Admin');
    const Course = require('../models/Course');
    
    // Check if admin exists - use different method
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'notUsername' });
    if (!adminExists) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'notUsername',
        password: process.env.ADMIN_PASSWORD || 'notPassword'
      });
      console.log('Default admin created');
    }

    // Check if default courses exist
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const defaultCourses = [
        {
          key: 'html',
          name: 'HTML',
          days: [
            {
              day: 'day-1',
              topic: 'HTML Basics',
              description: 'Learn fundamental HTML tags and structure',
              category: 'basic',
              quizes: [
                {
                  id: 1731417600000,
                  question: 'What does HTML stand for?',
                  options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                  ],
                  answer: 0,
                  category: 'basic',
                  explanation: 'HTML stands for Hyper Text Markup Language...'
                }
              ]
            }
          ]
        },
        {
          key: 'css',
          name: 'CSS',
          days: [
            {
              day: 'day-1',
              topic: 'CSS Basics',
              description: 'Learn fundamental CSS properties and selectors',
              category: 'basic',
              quizes: []
            }
          ]
        }
      ];

      await Course.insertMany(defaultCourses);
      console.log('Default courses created');
    }
  } catch (error) {
    console.error('Data initialization error:', error);
  }
};

module.exports = connectDB;















// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
    
//     // Initialize default data
//     await initializeDefaultData();
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1);
//   }
// };

// const initializeDefaultData = async () => {
//   const Admin = require('../models/Admin');
//   const Course = require('../models/Course');
  
//   // Check if admin exists
//   const adminCount = await Admin.countDocuments();
//   if (adminCount === 0) {
//     await Admin.create({
//       username: process.env.ADMIN_USERNAME || 'notUsername',
//       password: process.env.ADMIN_PASSWORD || 'notPassword'
//     });
//     console.log('Default admin created');
//   }

//   // Check if default courses exist
//   const courseCount = await Course.countDocuments();
//   if (courseCount === 0) {
//     const defaultCourses = [
//       {
//         key: 'html',
//         name: 'HTML',
//         days: [
//           {
//             day: 'day-1',
//             topic: 'HTML Basics',
//             description: 'Learn fundamental HTML tags and structure',
//             category: 'basic',
//             quizes: [
//               {
//                 id: 1731417600000,
//                 question: 'What does HTML stand for?',
//                 options: [
//                   'Hyper Text Markup Language',
//                   'High Tech Modern Language',
//                   'Hyper Transfer Markup Language',
//                   'Home Tool Markup Language'
//                 ],
//                 answer: 0,
//                 category: 'basic',
//                 explanation: 'HTML stands for Hyper Text Markup Language...'
//               }
//             ]
//           }
//         ]
//       },
//       {
//         key: 'css',
//         name: 'CSS',
//         days: [
//           {
//             day: 'day-1',
//             topic: 'CSS Basics',
//             description: 'Learn fundamental CSS properties and selectors',
//             category: 'basic',
//             quizes: []
//           }
//         ]
//       }
//     ];

//     await Course.insertMany(defaultCourses);
//     console.log('Default courses created');
//   }
// };

// module.exports = connectDB;