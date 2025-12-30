import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/StudentHome';
import LandingPage from './pages/LandingPage';
import ChangePassword from './pages/ChangePassword';

// Student Pages
import CourseDetails from './pages/CourseDetails';
import MyCourses from './pages/MyCourses';
import CourseVideos from './pages/CourseVideos';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'; 
import AdminCourses from './pages/AdminCourses';     
import AddCourse from './pages/AddCourse';
import UpdateCourse from './pages/UpdateCourse';
import VideoDashboard from './pages/VideoDashboard';
import AddVideo from './pages/AddVideo';
import UpdateVideo from './pages/UpdateVideo';
import StudentList from './pages/StudentList';

function App() {
  
  useEffect(() => {
    // UPDATED: Default to 'light' if no theme is saved
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <div className="container-fluid p-0">
         <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            <Route path='/home' element={<StudentHome />} />
            <Route path='/course-details/:id' element={<CourseDetails />} />
            <Route path='/my-courses' element={<MyCourses />} />
            <Route path='/course-videos/:id' element={<CourseVideos />} />
            <Route path='/change-password' element={<ChangePassword />} />
            
            <Route path='/admin-dashboard' element={<AdminDashboard />} /> 
            <Route path='/admin-courses' element={<AdminCourses />} /> 
            
            <Route path='/add-course' element={<AddCourse />} />
            <Route path='/update-course' element={<UpdateCourse />} />
            
            <Route path='/video-dashboard' element={<VideoDashboard />} />
            <Route path='/add-video' element={<AddVideo />} />
            <Route path='/update-video' element={<UpdateVideo />} />
            
            <Route path='/student-list' element={<StudentList />} />
         </Routes>
         
         <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;