import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyCourses } from '../services/course.service';
import StudentNavbar from '../components/StudentNavbar';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyCourses = async () => {
      const token = sessionStorage.getItem('token');
      const result = await getMyCourses(token);
      if (result.status === 'success') {
        setCourses(result.data);
      } else {
        toast.error('Failed to load registered courses');
      }
    };
    loadMyCourses();
  }, []);

  return (
    <div>
      <StudentNavbar />
      <div className='container'>
        <h2 className='mb-4'>My Registered Courses</h2>
        <div className='row'>
          {courses.map((course) => (
            <div key={course.id} className='col-md-4 mb-4'>
              <div className='card shadow-sm h-100' onClick={() => navigate(`/course-videos/${course.id}`, { state: { course } })} style={{ cursor: 'pointer' }}>
                <div className='card-body'>
                    <h5 className='card-title'>{course.title}</h5>
                    <p className='text-muted small'>Validity: {course.start_date?.split('T')[0]} to {course.end_date?.split('T')[0]}</p>
                    <div className='text-end text-primary'>
                        Open Course &gt;
                    </div>
                </div>
              </div>
            </div>
          ))}
           {courses.length === 0 && <p className='text-muted'>You have not enrolled in any courses yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;