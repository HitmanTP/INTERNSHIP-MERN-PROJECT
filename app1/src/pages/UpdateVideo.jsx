import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateVideo } from '../services/video.service';
import AdminNavbar from '../components/AdminNavbar';

function UpdateVideo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state || {};
  const [title, setTitle] = useState(video?.title || '');
  const [url, setUrl] = useState(video?.url || '');
  const [description, setDescription] = useState(video?.description || '');

  const onUpdate = async () => {
    const token = sessionStorage.getItem('token');
    const result = await updateVideo(video.id, title, url, description, token);
    if (result.status === 'success') { toast.success('Updated'); navigate('/video-dashboard'); }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container w-50 mx-auto'>
        <h2 className='text-center mb-4'>Update Video</h2>
        <div className='mb-3'><label>Course</label><input value={video?.course_title} disabled className='form-control' /></div>
        <div className='mb-3'><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className='form-control' /></div>
        <div className='mb-3'><label>URL</label><input value={url} onChange={(e) => setUrl(e.target.value)} className='form-control' /></div>
        <div className='mb-3'><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className='form-control'></textarea></div>
        <button onClick={onUpdate} className='btn btn-primary me-2'>Update</button>
        <button onClick={() => navigate('/video-dashboard')} className='btn btn-danger'>Cancel</button>
      </div>
    </div>
  );
}
export default UpdateVideo;