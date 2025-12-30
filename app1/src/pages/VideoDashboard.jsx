import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllVideos, deleteVideo } from '../services/video.service';
import { getAllCourses } from '../services/course.service'; // 1. Import Course Service
import AdminNavbar from '../components/AdminNavbar';

function VideoDashboard() {
  const [videos, setVideos] = useState([]);           // Stores ALL videos (Master List)
  const [filteredVideos, setFilteredVideos] = useState([]); // Stores videos currently visible
  const [courses, setCourses] = useState([]);         // Stores list of courses for Dropdown
  const [selectedCourse, setSelectedCourse] = useState('All'); // Tracks selected filter

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = sessionStorage.getItem('token');
    
    // 1. Load All Videos
    const videoResult = await getAllVideos(token);
    if (videoResult.status === 'success') {
      setVideos(videoResult.data);
      setFilteredVideos(videoResult.data); // Initially, show all videos
    }

    // 2. Load All Courses (for the dropdown)
    const courseResult = await getAllCourses(token);
    if (courseResult.status === 'success') {
      setCourses(courseResult.data);
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('Delete this video?')) {
      const token = sessionStorage.getItem('token');
      const result = await deleteVideo(id, token);
      if (result.status === 'success') { 
        toast.success('Deleted'); 
        loadData(); // Reloads data to refresh the list
      }
    }
  };

  // --- FILTER LOGIC ---
  const handleFilterChange = (e) => {
    const courseTitle = e.target.value;
    setSelectedCourse(courseTitle);

    if (courseTitle === 'All') {
      // Reset to show everything
      setFilteredVideos(videos);
    } else {
      // Filter based on the course title column
      const filtered = videos.filter(v => v.course_title === courseTitle);
      setFilteredVideos(filtered);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
            <h2>All Videos</h2>
            <button onClick={() => navigate('/add-video')} className='btn btn-success'>
              Add Video
            </button>
        </div>

        {/* --- FILTER DROPDOWN (Added) --- */}
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
                <div className="col-md-4 text-end text-muted">
                    Showing {filteredVideos.length} video(s)
                </div>
            </div>
        </div>

        {/* --- TABLE (Updated to use filteredVideos) --- */}
        <table className='table table-striped shadow-sm align-middle'>
          <thead className='table-dark'>
            <tr>
              <th>ID</th>
              <th>Course</th>
              <th>Title</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>
                    <span className='badge bg-info text-dark'>{v.course_title}</span>
                </td>
                <td className='fw-semibold'>{v.title}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={v.url} target="_blank" rel="noopener noreferrer">{v.url}</a>
                </td>
                <td>
                  <button onClick={() => navigate('/update-video', { state: { video: v } })} className='btn btn-sm btn-primary me-2'>Edit</button>
                  <button onClick={() => onDelete(v.id)} className='btn btn-sm btn-danger'>Delete</button>
                </td>
              </tr>
            ))}
            {filteredVideos.length === 0 && (
                <tr>
                    <td colSpan='5' className='text-center py-4 text-muted'>
                        No videos found for the selected course.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default VideoDashboard;