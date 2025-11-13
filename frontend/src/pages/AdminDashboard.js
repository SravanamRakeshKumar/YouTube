// src/pages/AdminDashboard.js (Fixed)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    startedCourses: 0,
    totalDays: 0,
    totalUsers: 0
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Predefined courses with their icons
  const predefinedCourses = [
    { key: 'html', name: 'HTML', icon: 'fab fa-html5' },
    { key: 'css', name: 'CSS', icon: 'fab fa-css3-alt' },
    { key: 'javascript', name: 'JavaScript', icon: 'fab fa-js' },
    { key: 'python', name: 'Python', icon: 'fab fa-python' },
    { key: 'java', name: 'Java', icon: 'fab fa-java' },
    { key: 'react', name: 'React', icon: 'fab fa-react' },
    { key: 'c', name: 'C Programming', icon: 'fas fa-code' }
  ];

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');
      
      const [statsData, coursesData, allCoursesData] = await Promise.all([
        api.getStats(),
        api.getCoursesProgress(),
        api.getCourses() // Get all existing courses to filter available ones
      ]);
      
      console.log('Stats response:', statsData);
      console.log('Courses response:', coursesData);
      console.log('All courses data:', allCoursesData);
      
      // Handle the response properly
      if (statsData && typeof statsData === 'object') {
        setStats(statsData);
      }
      
      if (coursesData && Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        console.error('Unexpected courses data format:', coursesData);
        setCourses([]);
      }

      // Filter available courses (only show courses that don't exist)
      if (allCoursesData && typeof allCoursesData === 'object') {
        const existingCourseKeys = Object.keys(allCoursesData);
        const available = predefinedCourses.filter(course => 
          !existingCourseKeys.includes(course.key)
        );
        setAvailableCourses(available);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Error loading dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [predefinedCourses]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate, loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) {
      alert('Please select a course');
      return;
    }

    try {
      setAddingCourse(true);
      const selectedCourseData = predefinedCourses.find(course => course.key === selectedCourse);
      
      if (!selectedCourseData) {
        alert('Invalid course selection');
        return;
      }

      const result = await api.addCourse(selectedCourseData.key, selectedCourseData.name, selectedCourseData.icon);
      
      if (result.success) {
        alert(`Course "${selectedCourseData.name}" added successfully!`);
        setShowAddCoursePopup(false);
        setSelectedCourse('');
        // Reload dashboard data to show the new course
        loadDashboardData();
      } else {
        alert('Failed to add course: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course');
    } finally {
      setAddingCourse(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white mr-4`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-xl text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAddCoursePopup(true)}
                className="btn-primary"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Course
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Courses" 
              value={stats.totalCourses || 0} 
              icon="fas fa-book"
              color="from-blue-500 to-cyan-500"
            />
            <StatCard 
              title="Started Courses" 
              value={stats.startedCourses || 0} 
              icon="fas fa-play-circle"
              color="from-green-500 to-teal-500"
            />
            <StatCard 
              title="Total Days" 
              value={stats.totalDays || 0} 
              icon="fas fa-calendar-alt"
              color="from-purple-500 to-pink-500"
            />
            <StatCard 
              title="Total Users" 
              value={(stats.totalUsers || 0).toLocaleString()} 
              icon="fas fa-users"
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Course Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div key={index} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className={`h-2 bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <i className={`${course.icon || 'fas fa-book'} text-3xl mr-4 ${(course.color || 'from-blue-500 to-purple-500').replace('from-', 'text-').split(' ')[0]}`}></i>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{course.name || 'Unnamed Course'}</h3>
                      <p className="text-sm text-gray-600">{course.days || 0} days completed</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(course.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      to={`/admin/topic-selection?course=${course.value || course.name?.toLowerCase() || 'html'}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Add Questions
                    </Link>
                    <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                      <i className="fas fa-chart-bar mr-2"></i>
                      Analytics
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Course Popup */}
      {showAddCoursePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Course</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a course...</option>
                  {availableCourses.map((course) => (
                    <option key={course.key} value={course.key}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {availableCourses.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    All predefined courses have been added.
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowAddCoursePopup(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                disabled={addingCourse || !selectedCourse || availableCourses.length === 0}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {addingCourse ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Add Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;















// // src/pages/AdminDashboard.js (Updated)
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { api } from '../services/api';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     startedCourses: 0,
//     totalDays: 0,
//     totalUsers: 0
//   });
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [addingCourse, setAddingCourse] = useState(false);
//   const [availableCourses, setAvailableCourses] = useState([]);

//   // Predefined courses with their icons
//   const predefinedCourses = [
//     { key: 'html', name: 'HTML', icon: 'fab fa-html5' },
//     { key: 'css', name: 'CSS', icon: 'fab fa-css3-alt' },
//     { key: 'javascript', name: 'JavaScript', icon: 'fab fa-js' },
//     { key: 'python', name: 'Python', icon: 'fab fa-python' },
//     { key: 'java', name: 'Java', icon: 'fab fa-java' },
//     { key: 'react', name: 'React', icon: 'fab fa-react' },
//     { key: 'c', name: 'C Programming', icon: 'fas fa-code' }
//   ];

//   useEffect(() => {
//   const token = localStorage.getItem('adminToken');
//   if (!token) {
//     navigate('/admin/login');
//     return;
//   }
//   loadDashboardData();
// }, [navigate]); // Add loadDashboardData to dependencies

//   // useEffect(() => {
//   //   const token = localStorage.getItem('adminToken');
//   //   if (!token) {
//   //     navigate('/admin/login');
//   //     return;
//   //   }
//   //   loadDashboardData();
//   // }, [navigate]);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       console.log('Loading dashboard data...');
      
//       const [statsData, coursesData, allCoursesData] = await Promise.all([
//         api.getStats(),
//         api.getCoursesProgress(),
//         api.getCourses() // Get all existing courses to filter available ones
//       ]);
      
//       console.log('Stats response:', statsData);
//       console.log('Courses response:', coursesData);
//       console.log('All courses data:', allCoursesData);
      
//       // Handle the response properly
//       if (statsData && typeof statsData === 'object') {
//         setStats(statsData);
//       }
      
//       if (coursesData && Array.isArray(coursesData)) {
//         setCourses(coursesData);
//       } else {
//         console.error('Unexpected courses data format:', coursesData);
//         setCourses([]);
//       }

//       // Filter available courses (only show courses that don't exist)
//       if (allCoursesData && typeof allCoursesData === 'object') {
//         const existingCourseKeys = Object.keys(allCoursesData);
//         const available = predefinedCourses.filter(course => 
//           !existingCourseKeys.includes(course.key)
//         );
//         setAvailableCourses(available);
//       }
      
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       alert('Error loading dashboard data: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     navigate('/admin/login');
//   };

//   const handleAddCourse = async () => {
//     if (!selectedCourse) {
//       alert('Please select a course');
//       return;
//     }

//     try {
//       setAddingCourse(true);
//       const selectedCourseData = predefinedCourses.find(course => course.key === selectedCourse);
      
//       if (!selectedCourseData) {
//         alert('Invalid course selection');
//         return;
//       }

//       const result = await api.addCourse(selectedCourseData.key, selectedCourseData.name, selectedCourseData.icon);
      
//       if (result.success) {
//         alert(`Course "${selectedCourseData.name}" added successfully!`);
//         setShowAddCoursePopup(false);
//         setSelectedCourse('');
//         // Reload dashboard data to show the new course
//         loadDashboardData();
//       } else {
//         alert('Failed to add course: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error adding course:', error);
//       alert('Error adding course');
//     } finally {
//       setAddingCourse(false);
//     }
//   };

//   const StatCard = ({ title, value, icon, color }) => (
//     <div className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//       <div className="flex items-center">
//         <div className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white mr-4`}>
//           <i className={`${icon} text-xl`}></i>
//         </div>
//         <div>
//           <p className="text-sm text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-800">{value}</p>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
//           <p className="text-xl text-gray-600">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-lg">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Admin Dashboard
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={() => setShowAddCoursePopup(true)}
//                 className="btn-primary"
//               >
//                 <i className="fas fa-plus mr-2"></i>
//                 Add Course
//               </button>
//               {/* <Link 
//                 to="/admin/topic-selection" 
//                 className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
//               >
//                 <i className="fas fa-edit mr-2"></i>
//                 Add Questions
//               </Link> */}
//               <button
//                 onClick={handleLogout}
//                 className="text-gray-600 hover:text-red-600 transition-colors"
//               >
//                 <i className="fas fa-sign-out-alt mr-2"></i>
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Stats Section */}
//       <section className="py-8">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <StatCard 
//               title="Total Courses" 
//               value={stats.totalCourses || 0} 
//               icon="fas fa-book"
//               color="from-blue-500 to-cyan-500"
//             />
//             <StatCard 
//               title="Started Courses" 
//               value={stats.startedCourses || 0} 
//               icon="fas fa-play-circle"
//               color="from-green-500 to-teal-500"
//             />
//             <StatCard 
//               title="Total Days" 
//               value={stats.totalDays || 0} 
//               icon="fas fa-calendar-alt"
//               color="from-purple-500 to-pink-500"
//             />
//             <StatCard 
//               title="Total Users" 
//               value={(stats.totalUsers || 0).toLocaleString()} 
//               icon="fas fa-users"
//               color="from-orange-500 to-red-500"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Courses Section */}
//       <section className="py-8">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-bold mb-8 text-gray-800">Course Management</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {courses.map((course, index) => (
//               <div key={index} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//                 <div className={`h-2 bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}></div>
//                 <div className="p-6">
//                   <div className="flex items-center mb-4">
//                     <i className={`${course.icon || 'fas fa-book'} text-3xl mr-4 ${(course.color || 'from-blue-500 to-purple-500').replace('from-', 'text-').split(' ')[0]}`}></i>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">{course.name || 'Unnamed Course'}</h3>
//                       <p className="text-sm text-gray-600">{course.days || 0} days completed</p>
//                     </div>
//                   </div>
                  
//                   <div className="mb-4">
//                     <div className="flex justify-between text-sm text-gray-600 mb-1">
//                       <span>Progress</span>
//                       <span>{Math.round(course.progress || 0)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className={`h-2 rounded-full bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}
//                         style={{ width: `${course.progress || 0}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   <div className="flex space-x-2">
//                     <Link 
//                       to={`/admin/topic-selection?course=${course.value || course.name?.toLowerCase() || 'html'}`}
//                       className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
//                     >
//                       <i className="fas fa-edit mr-2"></i>
//                       Add Questions
//                     </Link>
//                     <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
//                       <i className="fas fa-chart-bar mr-2"></i>
//                       Analytics
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Add Course Popup */}
//       {showAddCoursePopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Course</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Course *
//                 </label>
//                 <select
//                   value={selectedCourse}
//                   onChange={(e) => setSelectedCourse(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Choose a course...</option>
//                   {availableCourses.map((course) => (
//                     <option key={course.key} value={course.key}>
//                       {course.name}
//                     </option>
//                   ))}
//                 </select>
//                 {availableCourses.length === 0 && (
//                   <p className="text-sm text-gray-500 mt-2">
//                     All predefined courses have been added.
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex space-x-4 mt-8">
//               <button
//                 onClick={() => setShowAddCoursePopup(false)}
//                 className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCourse}
//                 disabled={addingCourse || !selectedCourse || availableCourses.length === 0}
//                 className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 {addingCourse ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin mr-2"></i>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <i className="fas fa-plus mr-2"></i>
//                     Add Course
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;









// // // src/pages/AdminDashboard.js (Updated)
// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { api } from '../services/api';

// // const AdminDashboard = () => {
// //   const navigate = useNavigate();
// //   const [stats, setStats] = useState({
// //     totalCourses: 0,
// //     startedCourses: 0,
// //     totalDays: 0,
// //     totalUsers: 0
// //   });
// //   const [courses, setCourses] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem('adminToken');
// //     if (!token) {
// //       navigate('/admin/login');
// //       return;
// //     }
// //     loadDashboardData();
// //   }, [navigate]);

// //   const loadDashboardData = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('Loading dashboard data...');
      
// //       const [statsData, coursesData] = await Promise.all([
// //         api.getStats(),
// //         api.getCoursesProgress()
// //       ]);
      
// //       console.log('Stats response:', statsData);
// //       console.log('Courses response:', coursesData);
      
// //       // Handle the response properly
// //       if (statsData && typeof statsData === 'object') {
// //         setStats(statsData);
// //       }
      
// //       if (coursesData && Array.isArray(coursesData)) {
// //         setCourses(coursesData);
// //       } else {
// //         console.error('Unexpected courses data format:', coursesData);
// //         setCourses([]);
// //       }
      
// //     } catch (error) {
// //       console.error('Error loading dashboard:', error);
// //       alert('Error loading dashboard data: ' + error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem('adminToken');
// //     navigate('/admin/login');
// //   };

// //   const StatCard = ({ title, value, icon, color }) => (
// //     <div className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-200">
// //       <div className="flex items-center">
// //         <div className={`p-3 rounded-lg bg-gradient-to-r ${color} text-white mr-4`}>
// //           <i className={`${icon} text-xl`}></i>
// //         </div>
// //         <div>
// //           <p className="text-sm text-gray-600">{title}</p>
// //           <p className="text-2xl font-bold text-gray-800">{value}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
// //           <p className="text-xl text-gray-600">Loading Dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white shadow-lg">
// //         <div className="container mx-auto px-6 py-4">
// //           <div className="flex justify-between items-center">
// //             <div className="flex items-center space-x-4">
// //               <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //                 Admin Dashboard
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <Link 
// //                 to="/admin/topic-selection" 
// //                 className="btn-primary"
// //               >
// //                 <i className="fas fa-plus mr-2"></i>
// //                 Add Courses
// //               </Link>
// //               <button
// //                 onClick={handleLogout}
// //                 className="text-gray-600 hover:text-red-600 transition-colors"
// //               >
// //                 <i className="fas fa-sign-out-alt mr-2"></i>
// //                 Logout
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Stats Section */}
// //       <section className="py-8">
// //         <div className="container mx-auto px-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //             <StatCard 
// //               title="Total Courses" 
// //               value={stats.totalCourses || 0} 
// //               icon="fas fa-book"
// //               color="from-blue-500 to-cyan-500"
// //             />
// //             <StatCard 
// //               title="Started Courses" 
// //               value={stats.startedCourses || 0} 
// //               icon="fas fa-play-circle"
// //               color="from-green-500 to-teal-500"
// //             />
// //             <StatCard 
// //               title="Total Days" 
// //               value={stats.totalDays || 0} 
// //               icon="fas fa-calendar-alt"
// //               color="from-purple-500 to-pink-500"
// //             />
// //             <StatCard 
// //               title="Total Users" 
// //               value={(stats.totalUsers || 0).toLocaleString()} 
// //               icon="fas fa-users"
// //               color="from-orange-500 to-red-500"
// //             />
// //           </div>
// //         </div>
// //       </section>

// //       {/* Courses Section */}
// //       <section className="py-8">
// //         <div className="container mx-auto px-6">
// //           <h2 className="text-3xl font-bold mb-8 text-gray-800">Course Management</h2>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {courses.map((course, index) => (
// //               <div key={index} className="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
// //                 <div className={`h-2 bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}></div>
// //                 <div className="p-6">
// //                   <div className="flex items-center mb-4">
// //                     <i className={`${course.icon || 'fas fa-book'} text-3xl mr-4 ${(course.color || 'from-blue-500 to-purple-500').replace('from-', 'text-').split(' ')[0]}`}></i>
// //                     <div>
// //                       <h3 className="text-xl font-bold text-gray-800">{course.name || 'Unnamed Course'}</h3>
// //                       <p className="text-sm text-gray-600">{course.days || 0} days completed</p>
// //                     </div>
// //                   </div>
                  
// //                   <div className="mb-4">
// //                     <div className="flex justify-between text-sm text-gray-600 mb-1">
// //                       <span>Progress</span>
// //                       <span>{Math.round(course.progress || 0)}%</span>
// //                     </div>
// //                     <div className="w-full bg-gray-200 rounded-full h-2">
// //                       <div 
// //                         className={`h-2 rounded-full bg-gradient-to-r ${course.color || 'from-blue-500 to-purple-500'}`}
// //                         style={{ width: `${course.progress || 0}%` }}
// //                       ></div>
// //                     </div>
// //                   </div>

// //                   <div className="flex space-x-2">
// //                     <Link 
// //                       to={`/admin/topic-selection?course=${course.value || course.name?.toLowerCase() || 'html'}`}
// //                       className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors"
// //                     >
// //                       <i className="fas fa-edit mr-2"></i>
// //                       Add Questions
// //                     </Link>
// //                     <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
// //                       <i className="fas fa-chart-bar mr-2"></i>
// //                       Analytics
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;
