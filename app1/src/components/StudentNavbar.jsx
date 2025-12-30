import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const userName = sessionStorage.getItem('userName') || 'Profile';

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const onLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <nav 
        className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'} mb-4 shadow-sm`}
        style={{ 
            backgroundColor: 'var(--navbar-bg)', 
            transition: 'background-color 0.3s',
            position: 'relative', 
            zIndex: 1000 
        }}
    >
      <div className="container-fluid">
        {/* CHANGED: 'Student Portal' -> 'Course Mania (Student)' */}
        <Link className="navbar-brand fw-bold" to="/home">
            <i className="bi bi-mortarboard-fill me-2"></i>
            Course Mania (Student)
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#studentNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="studentNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/home')}`} to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/my-courses')}`} to="/my-courses">My Courses</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
             <button 
                onClick={toggleTheme} 
                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                title="Toggle Theme"
             >
                {theme === 'dark' ? '☀️' : '🌙'}
             </button>

            <div className="dropdown">
              <button 
                className="btn btn-secondary dropdown-toggle d-flex align-items-center gap-2" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle"></i> 
                {userName}
              </button>
              
              <ul className="dropdown-menu dropdown-menu-end shadow"
                  style={{ zIndex: 1050 }}
              >
                <li><h6 className="dropdown-header">User Settings</h6></li>
                <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button onClick={onLogout} className="dropdown-item text-danger">Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;