import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PublicNavbar() {
  const navigate = useNavigate();
  
  // UPDATED: Default state is 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav 
        className="navbar navbar-expand-lg shadow-sm sticky-top"
        // UPDATED: Use variable so it changes color in dark mode
        style={{ 
            backgroundColor: 'var(--navbar-bg)', 
            fontFamily: "'Segoe UI', sans-serif",
            transition: 'background-color 0.3s ease'
        }}
    >
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-3">
            <i className="bi bi-mortarboard-fill me-2" style={{ color: 'var(--accent)' }}></i> 
            Course Mania
        </span>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="publicNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fw-bold" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
          </ul>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-outline-secondary me-3 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;