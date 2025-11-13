
# Quiz Learning Application

A full-stack quiz learning platform built with React.js frontend and Node.js/Express backend. Users can learn various programming languages through interactive quizzes organized by days and difficulty levels.

## 🚀 Features

### For Learners
- **Browse Courses**: HTML, CSS, JavaScript, Python, Java, React, C Programming
- **Category-based Learning**: Basic, Medium, Advanced levels
- **Interactive Quizzes**: Multiple-choice questions with instant feedback
- **Progress Tracking**: Track learning progress by days
- **Topic Details**: Detailed topic descriptions before starting quizzes

### For Admins
- **Admin Dashboard**: Comprehensive statistics and course management
- **Add Courses**: Easy course creation from predefined list
- **Quiz Management**: Add questions by topics and categories
- **Topic Organization**: Structured day-wise learning system

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **File System** - JSON-based database

## 📁 Project Structure

```
Quiz-Learning-App/
├── frontend/                 # React.js Frontend
│   ├── src/
│   │   ├── pages/           # Page Components
│   │   │   ├── CourseDays.js
│   │   │   ├── TopicDetail.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminQuestionEntry.js
│   │   │   └── TopicInfo.js
│   │   ├── services/
│   │   │   └── api.js       # API service functions
│   │   └── App.js           # Main App Component
│   ├── public/
│   └── package.json
├── backend/                  # Node.js Backend
│   ├── server.js            # Express server
│   ├── database.json        # JSON database
│   └── package.json
└── README.md
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. **Clone the repository**
```bash
git clone https://github.com/SravanamRakeshKumar/YouTube.git
cd YouTube
```

2. **Backend Setup**
```bash
cd backend
npm install
npm start
```
Backend server runs on `http://localhost:5000`

3. **Frontend Setup** (in new terminal)
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## 📊 Database Structure

```json
{
  "courses": {
    "html": {
      "name": "HTML",
      "days": {
        "day-1": {
          "topic": "HTML Basics",
          "description": "Learn fundamental HTML tags and structure",
          "category": "basic",
          "quizes": [
            {
              "id": 1731417600000,
              "question": "What does HTML stand for?",
              "options": ["Option1", "Option2", "Option3", "Option4"],
              "answer": 0,
              "explanation": "Detailed explanation..."
            }
          ]
        }
      }
    }
  }
}
```

## 🔑 Admin Access

- **URL**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## 🎯 Usage Guide

### For Students
1. Open `http://localhost:3000`
2. Select a course (HTML, CSS, JavaScript, etc.)
3. Choose difficulty level (Basic, Medium, Advanced)
4. Browse available days and topics
5. Click "Learn More" to view topic details
6. Start quiz if questions are available

### For Admins
1. Login to admin panel
2. Add new courses from predefined list
3. Navigate to "Add Questions"
4. Select course and category
5. Enter topic information
6. Add quiz questions with options and explanations

## 📡 API Endpoints

### Public Routes
- `GET /api/health` - Server health check
- `GET /api/courses` - Get all courses
- `GET /api/course-days/:course` - Get course days
- `GET /api/topic-detail/:course/:day` - Get topic details
- `GET /api/quiz/:course/:day` - Get quiz questions

### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/courses` - Add new course
- `POST /api/admin/days` - Add day with topic
- `POST /api/admin/questions` - Add quiz questions
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/courses-progress` - Get courses progress

## 🎨 Features in Detail

### Course Management
- 7 predefined programming courses
- Dynamic course addition
- Category-based filtering (Basic, Medium, Advanced)
- Day-wise progression system

### Quiz System
- Multiple-choice questions
- Instant answer validation
- Detailed explanations
- Progress tracking

### Admin Panel
- Real-time statistics
- Course progress monitoring
- Easy content management
- User-friendly interface

## 🔧 Configuration

### Backend Configuration
- Port: 5000
- CORS enabled for frontend
- JSON file-based database
- No external database required

### Frontend Configuration
- Port: 3000
- API base URL: `http://localhost:5000/api`
- Responsive design
- Mobile-friendly interface

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   ```bash
   # Change port in backend/server.js
   const PORT = 5001; // or any available port
   ```

2. **CORS errors**
   - Ensure backend is running on port 5000
   - Check if frontend is making requests to correct API URL

3. **API connection failed**
   ```bash
   # Verify backend is running
   curl http://localhost:5000/api/health
   ```

4. **Admin login issues**
   - Default credentials: admin/admin123
   - Check database.json for admin credentials

### Development Tips
- Backend auto-reload: Use `nodemon` instead of `node`
- Frontend hot-reload: Built into Create React App
- Database reset: Delete `database.json` to start fresh

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication and profiles
- [ ] Score tracking and leaderboards
- [ ] More quiz types (coding challenges, flashcards)
- [ ] Course completion certificates
- [ ] Mobile app version
- [ ] Social features and discussions

## 👨‍💻 Developer

**Sravanam Rakesh Kumar**
- GitHub: [@SravanamRakeshKumar](https://github.com/SravanamRakeshKumar)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by Font Awesome
- UI components with Tailwind CSS
- Built with React.js and Express.js

---

**Happy Learning!** 🎉
```

This README file includes:

1. **Project overview** and features
2. **Tech stack** information
3. **Installation instructions**
4. **Usage guide** for both students and admins
5. **API documentation**
6. **Troubleshooting** section
7. **Development details**
8. **Your GitHub profile** credit

Save this as `README.md` in your project root folder and push it to GitHub! 🚀
