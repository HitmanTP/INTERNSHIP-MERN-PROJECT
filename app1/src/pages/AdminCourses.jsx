import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllCourses, deleteCourse } from '../services/course.service';
import AdminNavbar from '../components/AdminNavbar';

function AdminCourses() {
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
        toast.success('Course deleted successfully');
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

      <div className='container mt-4'>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>All Courses</h2>
            <button className="btn btn-success" onClick={() => navigate('/add-course')}>
                <i className="bi bi-plus-lg me-2"></i>Add Course
            </button>
        </div>
        
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover table-striped mb-0 align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Image</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td className="ps-4">
                                        <img 
                                            src={course.image_url || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=64`} 
                                            alt={course.title}
                                            className="rounded"
                                            style={{ width: '64px', height: '48px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td className="fw-semibold">{course.title}</td>
                                    <td className="text-success fw-bold">₹ {course.price}</td>
                                    <td>{course.start_date ? course.start_date.split('T')[0] : 'N/A'}</td>
                                    <td>{course.end_date ? course.end_date.split('T')[0] : 'N/A'}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button 
                                                onClick={() => onEdit(course)} 
                                                className="btn btn-primary btn-sm"
                                                title="Edit"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => onDelete(course.id)} 
                                                className="btn btn-danger btn-sm"
                                                title="Delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No courses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourses;