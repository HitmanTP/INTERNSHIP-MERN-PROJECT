import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addCourse } from '../services/course.service';
import AdminNavbar from '../components/AdminNavbar';

function AddCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expireDays, setExpireDays] = useState('');
  
  // Handling Image: Supports both File Upload and URL
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onAddCourse = async () => {
    if (title.length === 0) {
      toast.warning('Please enter title');
      return;
    }
    if (description.length === 0) {
      toast.warning('Please enter description');
      return;
    }
    if (price.length === 0) {
      toast.warning('Please enter price');
      return;
    }
    if (startDate.length === 0) {
      toast.warning('Please enter start date');
      return;
    }
    if (endDate.length === 0) {
      toast.warning('Please enter end date');
      return;
    }

    const token = sessionStorage.getItem('token');
    
    // Calls the service function which handles FormData
    const result = await addCourse(title, description, price, startDate, endDate, imageFile, imageUrl, expireDays, token);
    
    if (result.status === 'success') {
      toast.success('Course added successfully');
      navigate('/admin-dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className='container w-50 mx-auto mb-5'>
        <h2 className='text-center mb-4'>Add New Course</h2>
        
        <div className='mb-3'>
            <label className='form-label'>Title</label>
            <input 
                onChange={(e) => setTitle(e.target.value)} 
                className='form-control' 
                placeholder='Course Title'
            />
        </div>

        <div className='mb-3'>
            <label className='form-label'>Description</label>
            <textarea 
                onChange={(e) => setDescription(e.target.value)} 
                className='form-control' 
                rows="3"
                placeholder='Course Description'
            ></textarea>
        </div>

        <div className='row mb-3'>
            <div className='col'>
                <label className='form-label'>Price (₹)</label>
                <input 
                    onChange={(e) => setPrice(e.target.value)} 
                    type='number' 
                    className='form-control' 
                />
            </div>
            <div className='col'>
                <label className='form-label'>Validity (Days)</label>
                <input 
                    onChange={(e) => setExpireDays(e.target.value)} 
                    type='number' 
                    className='form-control' 
                />
            </div>
        </div>

        <div className='row mb-3'>
            <div className='col'>
                <label className='form-label'>Start Date</label>
                <input 
                    onChange={(e) => setStartDate(e.target.value)} 
                    type='date' 
                    className='form-control' 
                />
            </div>
            <div className='col'>
                <label className='form-label'>End Date</label>
                <input 
                    onChange={(e) => setEndDate(e.target.value)} 
                    type='date' 
                    className='form-control' 
                />
            </div>
        </div>

        {/* Image Handling: File OR URL */}
        <div className='mb-3'>
            <label className='form-label'>Course Image (Upload File)</label>
            <input 
                onChange={onFileChange} 
                type='file' 
                className='form-control' 
                accept='image/*'
            />
        </div>
        <div className='text-center my-2 text-muted'>- OR -</div>
        <div className='mb-4'>
            <label className='form-label'>Image URL</label>
            <input 
                onChange={(e) => setImageUrl(e.target.value)} 
                className='form-control' 
                placeholder='http://example.com/image.jpg'
            />
        </div>

        <button onClick={onAddCourse} className='btn btn-success w-100 btn-lg'>
            Save Course
        </button>
        <button onClick={() => navigate('/admin-dashboard')} className='btn btn-danger w-100 mt-2'>
            Cancel
        </button>
      </div>
    </div>
  );
}

export default AddCourse;