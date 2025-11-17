// const express = require('express');
// const router = express.Router();
// const Visitor = require('../models/Visitor');
// const Course = require('../models/Course'); // Import Course model

// // Get statistics with real data
// router.get('/stats', async (req, res) => {
//   try {
//     // Get real visitor count
//     const totalUsers = await Visitor.countDocuments();
    
//     // Get real course data
//     const courses = await Course.find({});
    
//     // Calculate real course statistics
//     const totalCourses = courses.length;
    
//     // Count started courses (courses that have at least one day)
//     const startedCourses = courses.filter(course => 
//       course.days && course.days.length > 0
//     ).length;
    
//     // Calculate total days across all courses
//     let totalDays = 0;
//     courses.forEach(course => {
//       if (course.days && Array.isArray(course.days)) {
//         totalDays += course.days.length;
//       }
//     });

//     res.json({
//       totalCourses,
//       startedCourses,
//       totalDays,
//       totalUsers
//     });
//   } catch (error) {
//     console.error('Error getting stats:', error);
//     res.status(500).json({ error: 'Failed to get statistics' });
//   }
// });

// // Register visitor (keep this as is)
// router.post('/register-visit', async (req, res) => {
//   try {
//     const { deviceId, userAgent } = req.body;
    
//     if (!deviceId) {
//       return res.status(400).json({ error: 'Device ID is required' });
//     }
    
//     let visitor = await Visitor.findOne({ deviceId });
    
//     if (!visitor) {
//       visitor = new Visitor({
//         deviceId: deviceId,
//         userAgent: userAgent || ''
//       });
//       await visitor.save();
      
//       console.log(`New visitor registered: ${deviceId}`);
//       res.json({ 
//         success: true, 
//         isNewVisitor: true,
//         totalUsers: await Visitor.countDocuments()
//       });
//     } else {
//       visitor.lastVisit = new Date();
//       visitor.visitCount += 1;
//       await visitor.save();
      
//       console.log(`Existing visitor returned: ${deviceId}, total visits: ${visitor.visitCount}`);
//       res.json({ 
//         success: true, 
//         isNewVisitor: false,
//         totalUsers: await Visitor.countDocuments()
//       });
//     }
    
//   } catch (error) {
//     console.error('Error registering visit:', error);
    
//     if (error.code === 11000) {
//       return res.status(409).json({ error: 'Visitor already exists' });
//     }
    
//     res.status(500).json({ error: 'Failed to register visit' });
//   }
// });

// module.exports = router;










// const express = require('express');
// const router = express.Router();
// const Visitor = require('../models/Visitor');

// // Get statistics
// router.get('/stats', async (req, res) => {
//   try {
//     const totalUsers = await Visitor.countDocuments();
    
//     const totalCourses = 7;
//     const startedCourses = 3;
//     const totalDays = 30;

//     res.json({
//       totalCourses,
//       startedCourses,
//       totalDays,
//       totalUsers
//     });
//   } catch (error) {
//     console.error('Error getting stats:', error);
//     res.status(500).json({ error: 'Failed to get statistics' });
//   }
// });

// // Register visitor
// router.post('/register-visit', async (req, res) => {
//   try {
//     const { deviceId, userAgent } = req.body;
    
//     if (!deviceId) {
//       return res.status(400).json({ error: 'Device ID is required' });
//     }
    
//     let visitor = await Visitor.findOne({ deviceId });
    
//     if (!visitor) {
//       visitor = new Visitor({
//         deviceId: deviceId,
//         userAgent: userAgent || ''
//       });
//       await visitor.save();
      
//       console.log(`New visitor registered: ${deviceId}`);
//       res.json({ 
//         success: true, 
//         isNewVisitor: true,
//         totalUsers: await Visitor.countDocuments()
//       });
//     } else {
//       visitor.lastVisit = new Date();
//       visitor.visitCount += 1;
//       await visitor.save();
      
//       console.log(`Existing visitor returned: ${deviceId}, total visits: ${visitor.visitCount}`);
//       res.json({ 
//         success: true, 
//         isNewVisitor: false,
//         totalUsers: await Visitor.countDocuments()
//       });
//     }
    
//   } catch (error) {
//     console.error('Error registering visit:', error);
    
//     if (error.code === 11000) {
//       return res.status(409).json({ error: 'Visitor already exists' });
//     }
    
//     res.status(500).json({ error: 'Failed to register visit' });
//   }
// });

// module.exports = router;