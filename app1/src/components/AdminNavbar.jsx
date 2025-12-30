import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = sessionStorage.getItem('userName') || 'Admin';

  // 1. Get current theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // 2. Sync with global theme on load
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

  // Helper to check active state
  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';
  const isDropdownActive = (paths) => paths.includes(location.pathname) ? 'active fw-bold' : '';

  return (
    // FIX: Removed 'bg-dark'. Added dynamic class check based on theme.
    <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'} mb-4 shadow-sm`}
         style={{ backgroundColor: 'var(--navbar-bg)', transition: 'background-color 0.3s' }}>
      
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/admin-dashboard">
            <i className="bi bi-shield-lock-fill me-2"></i>
            Course Mania (Admin)
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="adminNav">
          <ul className="navbar-nav me-auto">
            
            {/* DASHBOARD */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin-dashboard')}`} to="/admin-dashboard">Dashboard</Link>
            </li>

            {/* COURSES DROPDOWN */}
            <li className="nav-item dropdown">
              <a 
                className={`nav-link dropdown-toggle ${isDropdownActive(['/admin-courses', '/add-course', '/update-course'])}`} 
                href="#" role="button" data-bs-toggle="dropdown"
              >
                Courses
              </a>
              <ul className="dropdown-menu shadow">
                <li><Link className={`dropdown-item ${isActive('/admin-courses')}`} to="/admin-courses">All Courses</Link></li>
                <li><Link className={`dropdown-item ${isActive('/add-course')}`} to="/add-course">Add Course</Link></li>
              </ul>
            </li>

            {/* VIDEOS DROPDOWN */}
            <li className="nav-item dropdown">
              <a 
                className={`nav-link dropdown-toggle ${isDropdownActive(['/video-dashboard', '/add-video', '/update-video'])}`} 
                href="#" role="button" data-bs-toggle="dropdown"
              >
                Videos
              </a>
              <ul className="dropdown-menu shadow">
                <li><Link className={`dropdown-item ${isActive('/video-dashboard')}`} to="/video-dashboard">All Videos</Link></li>
                <li><Link className={`dropdown-item ${isActive('/add-video')}`} to="/add-video">Add Video</Link></li>
              </ul>
            </li>

            {/* STUDENTS LINK */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/student-list')}`} to="/student-list">Students</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
             {/* Theme Toggle Button */}
             <button 
                onClick={toggleTheme} 
                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                title="Toggle Theme"
             >
                {theme === 'dark' ? '☀️' : '🌙'}
             </button>

             <div className="border-start mx-2" style={{ height: '25px' }}></div>

             <span className='fw-semibold me-2' style={{ color: 'var(--text-main)' }}>{userName}</span>
             
             <button onClick={onLogout} className="btn btn-danger btn-sm px-3 rounded-pill">
                Logout
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;