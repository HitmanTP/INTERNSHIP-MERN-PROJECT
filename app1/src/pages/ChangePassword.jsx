import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword } from '../services/user.service';
import StudentNavbar from '../components/StudentNavbar';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and Confirm password do not match');
      return;
    }

    const token = sessionStorage.getItem('token');
    const result = await changePassword(oldPassword, newPassword, token);

    if (result.status === 'success') {
      toast.success('Password changed successfully');
      navigate('/home');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <StudentNavbar />
      <div className='container d-flex justify-content-center mt-5'>
        <div className='card shadow p-4' style={{ width: '400px' }}>
          <h3 className='text-center mb-4'>Change Password</h3>
          
          <div className='mb-3'>
            <label>Old Password</label>
            <input 
              type='password' 
              className='form-control' 
              onChange={(e) => setOldPassword(e.target.value)} 
            />
          </div>

          <div className='mb-3'>
            <label>New Password</label>
            <input 
              type='password' 
              className='form-control' 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>

          <div className='mb-3'>
            <label>Confirm New Password</label>
            <input 
              type='password' 
              className='form-control' 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          <button onClick={onSubmit} className='btn btn-primary w-100'>Update Password</button>
          <button onClick={() => navigate('/home')} className='btn btn-link w-100 mt-2 text-decoration-none'>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;