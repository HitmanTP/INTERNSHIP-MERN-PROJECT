import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateCourse } from '../services/course.service';
import AdminNavbar from '../components/AdminNavbar';

function UpdateCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || '');
  const [startDate, setStartDate] = useState(course?.start_date?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(course?.end_date?.split('T')[0] || '');
  const [image, setImage] = useState(course?.image_url || '');
  const [expireDays, setExpireDays] = useState(course?.expire_days || '');

  const onUpdateCourse = async () => {
    const token = sessionStorage.getItem('token');
    const result = await updateCourse(course.id, title, description, price, startDate, endDate, image, expireDays, token);
    if (result.status === 'success') {
      toast.success('Course updated');
      navigate('/admin-dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container w-50 mx-auto'>
        <h2 className='text-center mb-4'>Update Course</h2>
        <div className='mb-3'><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className='form-control' /></div>
        <div className='mb-3'><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className='form-control'></textarea></div>
        <div className='mb-3'><label>Price</label><input value={price} onChange={(e) => setPrice(e.target.value)} type='number' className='form-control' /></div>
        <div className='mb-3'><label>Image URL</label><input value={image} onChange={(e) => setImage(e.target.value)} className='form-control' /></div>
        <div className='row mb-3'>
          <div className='col'><label>Start</label><input value={startDate} onChange={(e) => setStartDate(e.target.value)} type='date' className='form-control' /></div>
          <div className='col'><label>End</label><input value={endDate} onChange={(e) => setEndDate(e.target.value)} type='date' className='form-control' /></div>
        </div>
        <div className='mb-3'><label>Validity (Days)</label><input value={expireDays} onChange={(e) => setExpireDays(e.target.value)} type='number' className='form-control' /></div>
        <button onClick={onUpdateCourse} className='btn btn-primary me-2'>Update</button>
        <button onClick={() => navigate('/admin-dashboard')} className='btn btn-danger'>Cancel</button>
      </div>
    </div>
  );
}

export default UpdateCourse;