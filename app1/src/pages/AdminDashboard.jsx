import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCourses, deleteCourse } from '../services/course.service';
import AdminNavbar from '../components/AdminNavbar';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

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

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const token = sessionStorage.getItem('token');
      const result = await deleteCourse(id, token);
      if (result.status === 'success') {
        toast.success('Course deleted');
        loadCourses();
      } else {
        toast.error(result.error);
      }
    }
  };

  const onEdit = (course) => {
    navigate('/update-course', { state: { course } });
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container'>
        <h2 className='mb-4'>Dashboard</h2>
        <div className='row'>
          {courses.map((course) => (
            <div key={course.id} className='col-md-3 mb-4'>
              <div className='card shadow-sm h-100 text-center p-3'>
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '5px' }}>
                    <img 
                      src={course.image_url || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=128`} 
                      alt={course.title}
                      className="img-fluid"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className='card-body d-flex flex-column'>
                  <h5 className='card-title mt-2 fw-bold'>{course.title}</h5>
                  <p className='text-muted small mb-1'>Starts: {course.start_date ? course.start_date.split('T')[0] : 'N/A'}</p>
                  <p className='text-success fw-bold mb-3'>₹ {course.price}</p>
                  <div className='mt-auto d-flex justify-content-between gap-2'>
                    <button onClick={() => onEdit(course)} className='btn btn-primary btn-sm flex-grow-1'>Edit</button>
                    <button onClick={() => onDelete(course.id)} className='btn btn-danger btn-sm flex-grow-1'>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;