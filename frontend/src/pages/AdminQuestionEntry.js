// src/pages/AdminQuestionEntry.js (Fixed)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

const AdminQuestionEntry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course = searchParams.get('course');
  const category = searchParams.get('category');
  const topic = searchParams.get('topic');
  const description = searchParams.get('description');
  
  const [currentDay, setCurrentDay] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateNextDay = useCallback(async () => {
    try {
      const coursesData = await api.getCourses();
      const courseData = coursesData[course];
      
      if (courseData && courseData.days) {
        const dayNumbers = Object.keys(courseData.days)
          .filter(day => day.startsWith('day-'))
          .map(day => parseInt(day.replace('day-', '')))
          .sort((a, b) => a - b);
        
        const nextDay = dayNumbers.length > 0 ? Math.max(...dayNumbers) + 1 : 1;
        setCurrentDay(`day-${nextDay}`);
      } else {
        setCurrentDay('day-1');
      }
    } catch (error) {
      console.error('Error calculating next day:', error);
      setCurrentDay('day-1');
    }
  }, [course]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Calculate next day number based on existing days
    calculateNextDay();
  }, [navigate, course, calculateNextDay]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (!question || options.some(opt => !opt) || !answer || !explanation) {
      alert('Please fill all fields!');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question,
      options: [...options],
      answer: parseInt(answer),
      explanation,
    };

    setQuestionsList([...questionsList, newQuestion]);
    
    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
    setAnswer('');
    setExplanation('');
    
    // Show success animation
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleSubmitDay = async () => {
  if (questionsList.length === 0) {
    alert('Please add at least one question before submitting!');
    return;
  }

  try {
    // First create the day with topic and description
    const dayResult = await api.addDay(course, currentDay, topic, description, category);
    
    if (!dayResult.success) {
      alert('Failed to create day: ' + dayResult.message);
      return;
    }

    // Then add questions to the created day
    const questionsResult = await api.addQuestions(course, currentDay, questionsList);
    
    if (questionsResult.success) {
      alert(`Successfully submitted ${questionsList.length} questions for ${course} - ${currentDay}!`);
      navigate('/admin/dashboard');
    } else {
      alert('Failed to submit questions. Please try again.');
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Failed to submit questions. Please check your connection.');
  }
};

  // const handleSubmitDay = async () => {
  //   if (questionsList.length === 0) {
  //     alert('Please add at least one question before submitting!');
  //     return;
  //   }

  //   try {
  //     // Create day with topic, description, category AND questions
  //     const result = await api.addDay(course, currentDay, {
  //       topic: topic,
  //       description: description,
  //       category: category,
  //       quizes: questionsList  // Add the questions list here
  //     });
      
  //     if (result.success) {
  //       alert(`Successfully submitted ${questionsList.length} questions for ${course} - ${currentDay}!`);
  //       navigate('/admin/dashboard');
  //     } else {
  //       alert('Failed to submit questions. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Submit error:', error);
  //     alert('Failed to submit questions. Please check your connection.');
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add Questions
                </div>
                <div className="text-sm text-gray-600">
                  Course: <span className="font-semibold capitalize">{course}</span> | 
                  Level: <span className="font-semibold capitalize">{category}</span> | 
                  Day: <span className="font-semibold">{currentDay}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Questions added: <span className="font-bold text-blue-600">{questionsList.length}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Info Banner */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-2">{topic}</h3>
          <p className="text-blue-700 whitespace-pre-line break-all">{description}</p>
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <i className="fas fa-info-circle mr-2"></i>
            <span>Category: {category} | Course: {course} | Day: {currentDay}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Question Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Question</h3>
          
          {/* Question Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Options Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Answer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Answer *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAnswer(index.toString())}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    answer === index.toString()
                      ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{String.fromCharCode(65 + index)}</div>
                  <div className="text-sm truncate">{option || `Option ${String.fromCharCode(65 + index)}`}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation *
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why this answer is correct..."
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add Question Button */}
          <button
            onClick={handleAddQuestion}
            disabled={isSubmitting}
            className={`w-full btn-primary relative overflow-hidden ${
              isSubmitting ? 'bg-green-500 hover:bg-green-600' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-check-circle mr-2"></i>
                Question Added Successfully!
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i>
                Add Question to {currentDay.toUpperCase()}
              </>
            )}
          </button>
        </div>

        {/* Added Questions Preview */}
        {questionsList.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Added Questions ({questionsList.length})
            </h3>
            <div className="space-y-4">
              {questionsList.map((q, index) => (
                <div key={q.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {index + 1}. {q.question}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm p-2 rounded ${
                              optIndex === q.answer
                                ? 'bg-green-100 text-green-800 font-bold'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + optIndex)}.</span> {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newList = questionsList.filter(item => item.id !== q.id);
                        setQuestionsList(newList);
                      }}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Day Button */}
        {questionsList.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleSubmitDay}
              className="btn-primary bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-8 py-4 text-lg"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Submit {currentDay.toUpperCase()} ({questionsList.length} questions)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuestionEntry;





// // src/pages/AdminQuestionEntry.js (Updated)
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { api } from '../services/api';

// const AdminQuestionEntry = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const course = searchParams.get('course');
//   const category = searchParams.get('category');
//   const topic = searchParams.get('topic');
//   const description = searchParams.get('description');
  
//   const [currentDay, setCurrentDay] = useState('');
//   const [question, setQuestion] = useState('');
//   const [options, setOptions] = useState(['', '', '', '']);
//   const [answer, setAnswer] = useState('');
//   const [explanation, setExplanation] = useState('');
//   const [questionsList, setQuestionsList] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [courseDays, setCourseDays] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//       navigate('/admin/login');
//       return;
//     }

//     // Calculate next day number based on existing days
//     calculateNextDay();
//   }, [navigate, course, category,calculateNextDay]);

//   const calculateNextDay = async () => {
//     try {
//       const coursesData = await api.getCourses();
//       const courseData = coursesData[course];
      
//       if (courseData && courseData.days) {
//         const dayNumbers = Object.keys(courseData.days)
//           .filter(day => day.startsWith('day-'))
//           .map(day => parseInt(day.replace('day-', '')))
//           .sort((a, b) => a - b);
        
//         const nextDay = dayNumbers.length > 0 ? Math.max(...dayNumbers) + 1 : 1;
//         setCurrentDay(`day-${nextDay}`);
//         setCourseDays(dayNumbers);
//       } else {
//         setCurrentDay('day-1');
//         setCourseDays([]);
//       }
//     } catch (error) {
//       console.error('Error calculating next day:', error);
//       setCurrentDay('day-1');
//     }
//   };

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const handleAddQuestion = () => {
//     if (!question || options.some(opt => !opt) || !answer || !explanation) {
//       alert('Please fill all fields!');
//       return;
//     }

//     const newQuestion = {
//       id: Date.now(),
//       question,
//       options: [...options],
//       answer: parseInt(answer),
//       explanation,
//     //   category: category,
//     //   topic: topic,
//     //   description: description
//     };

//     setQuestionsList([...questionsList, newQuestion]);
    
//     // Reset form
//     setQuestion('');
//     setOptions(['', '', '', '']);
//     setAnswer('');
//     setExplanation('');
    
//     // Show success animation
//     setIsSubmitting(true);
//     setTimeout(() => setIsSubmitting(false), 1000);
//   };

//   const handleSubmitDay = async () => {
//   if (questionsList.length === 0) {
//     alert('Please add at least one question before submitting!');
//     return;
//   }

//   try {
//     // Create day with topic, description, category AND questions
//     const result = await api.addDay(course, currentDay, {
//       topic: topic,
//       description: description,
//       category: category,
//       quizes: questionsList  // Add the questions list here
//     });
    
//     if (result.success) {
//       alert(`Successfully submitted ${questionsList.length} questions for ${course} - ${currentDay}!`);
//       navigate('/admin/dashboard');
//     } else {
//       alert('Failed to submit questions. Please try again.');
//     }
//   } catch (error) {
//     console.error('Submit error:', error);
//     alert('Failed to submit questions. Please check your connection.');
//   }
// };


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-lg">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <div>
//                 <div className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Add Questions
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Course: <span className="font-semibold capitalize">{course}</span> | 
//                   Level: <span className="font-semibold capitalize">{category}</span> | 
//                   Day: <span className="font-semibold">{currentDay}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">
//                 Questions added: <span className="font-bold text-blue-600">{questionsList.length}</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Topic Info Banner */}
//       <div className="container mx-auto px-6 py-6">
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//           <h3 className="text-xl font-bold text-blue-800 mb-2">{topic}</h3>
//           <p className="text-blue-700">{description}</p>
//           <div className="flex items-center mt-2 text-sm text-blue-600">
//             <i className="fas fa-info-circle mr-2"></i>
//             <span>Category: {category} | Course: {course} | Day: {currentDay}</span>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-8">
//         {/* Question Form */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Question</h3>
          
//           {/* Question Input */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Question *
//             </label>
//             <textarea
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               placeholder="Enter your question here..."
//               className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Options Input */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Options *
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {options.map((option, index) => (
//                 <div key={index} className="flex items-center">
//                   <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
//                     {String.fromCharCode(65 + index)}
//                   </span>
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) => handleOptionChange(index, e.target.value)}
//                     placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Answer Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Correct Answer *
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {options.map((option, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => setAnswer(index.toString())}
//                   className={`p-4 border-2 rounded-lg text-center transition-all ${
//                     answer === index.toString()
//                       ? 'border-green-500 bg-green-50 text-green-700 font-bold'
//                       : 'border-gray-300 hover:border-blue-500'
//                   }`}
//                 >
//                   <div className="font-bold text-lg mb-1">{String.fromCharCode(65 + index)}</div>
//                   <div className="text-sm truncate">{option || `Option ${String.fromCharCode(65 + index)}`}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Explanation */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Explanation *
//             </label>
//             <textarea
//               value={explanation}
//               onChange={(e) => setExplanation(e.target.value)}
//               placeholder="Explain why this answer is correct..."
//               className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Add Question Button */}
//           <button
//             onClick={handleAddQuestion}
//             disabled={isSubmitting}
//             className={`w-full btn-primary relative overflow-hidden ${
//               isSubmitting ? 'bg-green-500 hover:bg-green-600' : ''
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <i className="fas fa-check-circle mr-2"></i>
//                 Question Added Successfully!
//               </>
//             ) : (
//               <>
//                 <i className="fas fa-plus mr-2"></i>
//                 Add Question to {currentDay.toUpperCase()}
//               </>
//             )}
//           </button>
//         </div>

//         {/* Added Questions Preview */}
//         {questionsList.length > 0 && (
//           <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//             <h3 className="text-2xl font-bold mb-6 text-gray-800">
//               Added Questions ({questionsList.length})
//             </h3>
//             <div className="space-y-4">
//               {questionsList.map((q, index) => (
//                 <div key={q.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-800">
//                         {index + 1}. {q.question}
//                       </p>
//                       <div className="mt-2 grid grid-cols-2 gap-2">
//                         {q.options.map((opt, optIndex) => (
//                           <div
//                             key={optIndex}
//                             className={`text-sm p-2 rounded ${
//                               optIndex === q.answer
//                                 ? 'bg-green-100 text-green-800 font-bold'
//                                 : 'bg-gray-100 text-gray-700'
//                             }`}
//                           >
//                             <span className="font-bold">{String.fromCharCode(65 + optIndex)}.</span> {opt}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         const newList = questionsList.filter(item => item.id !== q.id);
//                         setQuestionsList(newList);
//                       }}
//                       className="ml-4 text-red-500 hover:text-red-700"
//                     >
//                       <i className="fas fa-trash"></i>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Submit Day Button */}
//         {questionsList.length > 0 && (
//           <div className="text-center">
//             <button
//               onClick={handleSubmitDay}
//               className="btn-primary bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-8 py-4 text-lg"
//             >
//               <i className="fas fa-paper-plane mr-2"></i>
//               Submit {currentDay.toUpperCase()} ({questionsList.length} questions)
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminQuestionEntry;
