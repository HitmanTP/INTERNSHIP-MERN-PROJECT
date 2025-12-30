import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Player } from '@lottiefiles/react-lottie-player'; 
import { getActiveCourses } from '../services/course.service';
import PublicNavbar from '../components/PublicNavbar';

function LandingPage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const result = await getActiveCourses();
    if (result.status === 'success') {
      setCourses(result.data);
    } else {
      toast.error('Failed to load courses');
    }
  };

  return (
    // UPDATED: Background uses variable
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <PublicNavbar />
      
      {/* --- HERO SECTION --- */}
      <div 
        className='container-fluid d-flex flex-column align-items-center text-center pt-5'
        style={{ 
            // UPDATED: Uses CSS Variable for Gradient so it switches in Dark Mode
            background: 'var(--hero-bg)',
            color: 'var(--text-main)', 
            paddingBottom: '100px',
            marginBottom: '50px',
            borderRadius: '0 0 50px 50px',
            boxShadow: 'var(--hero-shadow)',
            transition: 'background 0.5s ease'
        }}
      >
        <div className='container' style={{ maxWidth: '900px' }}>
            <h1 className='fw-bold mb-3 display-4' style={{ color: 'var(--text-header)' }}>
                Shape Your Future. <br />
                <span style={{ color: 'var(--text-highlight)' }}>Master Your Passion.</span>
            </h1>
            
            <p className='lead mb-5' style={{ opacity: 0.8, fontSize: '1.3rem', fontWeight: '500', color: 'var(--text-main)' }}>
                Course Mania: Empowering Your Journey from <br/>
                <span className='fw-bold' style={{ color: 'var(--text-muted)' }}>Student to Professional.</span>
            </p>

            <div className='d-flex justify-content-center gap-3 mb-5'>
                <button 
                    onClick={() => navigate('/login')} 
                    className='btn btn-lg rounded-pill px-5 fw-bold shadow-sm'
                    style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        color: 'var(--text-highlight)', 
                        border: 'none',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Get Started
                </button>
                
                <button 
                    className='btn btn-lg rounded-pill px-5 fw-bold'
                    style={{ 
                        border: '2px solid var(--btn-glass-border)', 
                        color: 'var(--btn-glass-text)',
                        backgroundColor: 'transparent'
                    }}
                >
                    View Plans
                </button>
            </div>

            <div className='mt-4 d-flex justify-content-center'>
                <div style={{ maxWidth: '600px', width: '100%' }}>
                    <Player
                        autoplay
                        loop
                        src="https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"
                        style={{ height: '400px', width: '100%' }}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* --- COURSES SECTION --- */}
      <div className='container pb-5'>
        <div className='text-center mb-5'>
            <h2 className='fw-bold' style={{ color: 'var(--text-main)' }}>Explore Our Courses</h2>
            <p className='text-muted'>Select a course to begin your journey</p>
        </div>
        
        <div className='row justify-content-center'>
          {courses.map((course) => (
            <div key={course.id} className='col-md-3 mb-4'>
              <div 
                className='card shadow-sm h-100 text-center p-3 border-0'
                style={{ 
                    transition: 'all 0.3s ease',
                    // UPDATED: Background auto-switches
                }}
              >
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '15px', borderRadius: '10px' }}>
                    <img 
                      src={course.image_url || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=128`} 
                      alt={course.title}
                      className="img-fluid"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                    />
                </div>
                
                <div className='card-body d-flex flex-column p-0'>
                  <h5 className='card-title fw-bold' style={{ color: 'var(--text-main)' }}>{course.title}</h5>
                  <p className='text-muted small'>Starts on: {course.start_date ? course.start_date.split('T')[0] : 'N/A'}</p>
                  
                  <button 
                    onClick={() => navigate('/login')} 
                    className='btn mt-auto w-100 fw-bold rounded-pill'
                    style={{ 
                        backgroundColor: 'var(--bg-dark)', 
                        color: 'var(--accent)',           
                        border: '1px solid var(--accent)' 
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'var(--accent)';
                        e.target.style.color = '#FFFFFF';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'var(--bg-dark)';
                        e.target.style.color = 'var(--accent)';
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className='text-center mt-3 text-muted'>
                <p>No active courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;