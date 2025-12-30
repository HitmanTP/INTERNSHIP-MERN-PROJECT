import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { enrollCourse } from '../services/course.service';
import StudentNavbar from '../components/StudentNavbar';

function CourseDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
  const [showModal, setShowModal] = useState(false);

  // FIX: Create State for form fields so you can type in them
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');

  // FIX: Load data when the component mounts
  useEffect(() => {
    setUserName(sessionStorage.getItem('userName') || '');
    setUserEmail(sessionStorage.getItem('email') || '');
    setUserMobile(sessionStorage.getItem('mobile') || '');
  }, []);

  const onRegister = async () => {
    const token = sessionStorage.getItem('token');
    // Note: The backend uses the token to identify you, 
    // but we display these fields for confirmation.
    const result = await enrollCourse(course.id, token);
    
    if (result.status === 'success') {
      toast.success('Successfully Enrolled!');
      setShowModal(false);
      navigate('/my-courses');
    } else {
      toast.warning(result.error || 'Enrollment failed');
      setShowModal(false);
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <StudentNavbar />
      <div className='container mt-4'>
        {/* Course Details Card */}
        <div className='card shadow p-4'>
            <div className='text-center mb-4'>
                <img 
                    src={course.image_url || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=200`} 
                    alt={course.title} 
                    className="img-fluid"
                    style={{ maxHeight: '200px' }}
                />
            </div>
            <h2 className='text-center'>{course.title}</h2>
            <div className='row mt-4'>
                <div className='col-md-6'>
                    <p><strong>Start Date:</strong> {course.start_date?.split('T')[0]}</p>
                    <p><strong>End Date:</strong> {course.end_date?.split('T')[0]}</p>
                </div>
                <div className='col-md-6 text-end'>
                    <h4 className='text-success'>Fees: ₹{course.price}</h4>
                </div>
            </div>
            <p className='mt-3'>{course.description}</p>
            <button onClick={() => setShowModal(true)} className='btn btn-primary w-100 mt-3 p-3 fw-bold'>
                Register to Course
            </button>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register to Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2"><strong>Course Name:</strong> {course.title}</div>
                <div className="mb-3"><strong>Fees:</strong> ₹{course.price}</div>
                
                {/* FIX: Inputs are now connected to state and are editable */}
                <div className="mb-3">
                    <label>Full Name</label>
                    <input 
                        type="text" className="form-control" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label>Email Address</label>
                    <input 
                        type="text" className="form-control" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                    />
                </div>
                <div className="mb-3">
                    <label>Mobile Number</label>
                    <input 
                        type="text" className="form-control" 
                        value={userMobile} 
                        onChange={(e) => setUserMobile(e.target.value)} 
                    />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-info text-white fw-bold" onClick={onRegister}>Register</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;