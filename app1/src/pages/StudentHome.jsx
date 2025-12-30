
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCourses } from '../services/course.service';
import StudentNavbar from '../components/StudentNavbar'; // This imports the Navbar

function StudentHome() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      
      const result = await getAllCourses(token);
      if (result.status === 'success') {
        setCourses(result.data);
      } else {
        toast.error(result.error);
      }
    };
    loadCourses();
  }, [navigate]);

  return (
    <div>
      {/* 1. Navbar is added here */}
      <StudentNavbar />
      
      <div className='container mt-4'>
        <h2 className='mb-4'>Available Courses</h2>
        <div className='row'>
          {courses.map((course) => (
            <div key={course.id} className='col-md-3 mb-4'>
              <div className='card shadow-sm h-100 text-center p-3'>
                {/* Image Section */}
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img 
                      src={course.image_url || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=128`} 
                      alt={course.title}
                      className="img-fluid"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                </div>
                
                {/* Body Section */}
                <div className='card-body d-flex flex-column'>
                  <h5 className='card-title mt-2'>{course.title}</h5>
                  <p className='text-muted small'>Starts on: {course.start_date ? course.start_date.split('T')[0] : 'N/A'}</p>
                  
                  {/* 2. Changed 'Enroll' button to 'View More' to match the flow */}
                  <button 
                    onClick={() => navigate(`/course-details/${course.id}`, { state: { course } })} 
                    className='btn btn-primary mt-auto w-100'
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;