import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import { getAllCourses } from '../services/course.service'; // Import this to get the dropdown list

function StudentList() {
  const [allStudents, setAllStudents] = useState([]); // Stores the complete list from DB
  const [filteredStudents, setFilteredStudents] = useState([]); // Stores the list currently shown on screen
  const [courses, setCourses] = useState([]); // Stores the list of courses for the dropdown
  const [selectedCourse, setSelectedCourse] = useState('All'); // Tracks the selected filter

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      // 1. Fetch All Students
      const studentResponse = await axios.get(`${config.BASE_URL}/user/all-students`, { headers: { token } });
      if (studentResponse.data.status === 'success') {
        setAllStudents(studentResponse.data.data);
        setFilteredStudents(studentResponse.data.data); // Initially show everyone
      }

      // 2. Fetch All Courses (to populate the dropdown)
      const courseResponse = await getAllCourses(token);
      if (courseResponse.status === 'success') {
        setCourses(courseResponse.data);
      }

    } catch (error) { 
      toast.error('Error fetching data'); 
    }
  };

  // --- FILTER LOGIC ---
  const handleFilterChange = (e) => {
    const courseTitle = e.target.value;
    setSelectedCourse(courseTitle);

    if (courseTitle === 'All') {
      // If "All Courses" is selected, reset to the full list
      setFilteredStudents(allStudents);
    } else {
      // Filter the original list where the course name matches the selection
      // Note: We check if 's.course_name' matches because that's what the API returns
      const filtered = allStudents.filter(s => s.course_name === courseTitle);
      setFilteredStudents(filtered);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2>All Students</h2>
            <span className='badge bg-primary fs-6'>Total: {filteredStudents.length}</span>
        </div>

        {/* --- FILTER DROPDOWN --- */}
        <div className="card shadow-sm mb-4 p-3 bg-light border-0">
            <div className="row align-items-center">
                <div className="col-md-2 fw-bold text-secondary">
                    Filter by Course:
                </div>
                <div className="col-md-6">
                    <select 
                        className="form-select border-secondary" 
                        value={selectedCourse} 
                        onChange={handleFilterChange}
                    >
                        <option value="All">All Courses</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.title}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* --- STUDENT TABLE --- */}
        <div className="card shadow-sm border-0">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className='table table-bordered table-striped mb-0 align-middle'>
                      <thead className='table-dark'>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Enrolled Course</th>
                            <th>Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s, index) => (
                          <tr key={index}>
                            <td>{s.id}</td>
                            <td className="fw-semibold">{s.name}</td>
                            <td>{s.email}</td>
                            <td>
                                {s.course_name ? (
                                    <span className="badge bg-success">{s.course_name}</span>
                                ) : (
                                    <span className="badge bg-warning text-dark">Not Enrolled</span>
                                )}
                            </td>
                            <td>{s.mobile}</td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan='5' className='text-center py-4 text-muted'>
                                    No students found for this course.
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

export default StudentList;