import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addVideo } from '../services/video.service';
import { getAllCourses } from '../services/course.service';
import AdminNavbar from '../components/AdminNavbar';

function AddVideo() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      const token = sessionStorage.getItem('token');
      const result = await getAllCourses(token);
      if (result.status === 'success') setCourses(result.data);
    };
    loadCourses();
  }, []);

  const onAdd = async () => {
    if(!courseId || !title || !url) { toast.warning('Fill all fields'); return; }
    const token = sessionStorage.getItem('token');
    const result = await addVideo(courseId, title, url, description, token);
    if (result.status === 'success') { toast.success('Added'); navigate('/video-dashboard'); }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container w-50 mx-auto'>
        <h2 className='text-center mb-4'>Add Video</h2>
        <div className='mb-3'><label>Course</label>
          <select onChange={(e) => setCourseId(e.target.value)} className='form-select'>
            <option value=''>Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className='mb-3'><label>Title</label><input onChange={(e) => setTitle(e.target.value)} className='form-control' /></div>
        <div className='mb-3'><label>YouTube URL</label><input onChange={(e) => setUrl(e.target.value)} className='form-control' /></div>
        <div className='mb-3'><label>Description</label><textarea onChange={(e) => setDescription(e.target.value)} className='form-control'></textarea></div>
        <button onClick={onAdd} className='btn btn-success me-2'>Save</button>
        <button onClick={() => navigate('/video-dashboard')} className='btn btn-danger'>Cancel</button>
      </div>
    </div>
  );
}
export default AddVideo;