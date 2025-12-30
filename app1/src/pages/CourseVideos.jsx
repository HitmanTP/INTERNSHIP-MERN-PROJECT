import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllVideos } from '../services/video.service';
import StudentNavbar from '../components/StudentNavbar';

function CourseVideos() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    if (!course) { navigate('/my-courses'); return; }

    const loadVideos = async () => {
      const token = sessionStorage.getItem('token');
      const result = await getAllVideos(token);
      if (result.status === 'success') {
        // Filter videos for this specific course
        const courseVideos = result.data.filter(v => v.course_id === course.id);
        setVideos(courseVideos);
      }
    };
    loadVideos();
  }, [course, navigate]);

  const extractVideoId = (url) => {
     // Simple parser for YouTube IDs
     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
     const match = url?.match(regExp);
     return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <StudentNavbar />
      
      <div className='container-fluid px-4 py-3'>
         {/* --- 1. HEADER SECTION --- */}
         <div className='d-flex justify-content-between align-items-center mb-4'>
            <div>
                <button 
                    onClick={() => navigate('/my-courses')} 
                    className='btn btn-outline-secondary btn-sm mb-2 rounded-pill px-3'
                >
                    <i className="bi bi-arrow-left me-1"></i> Back to Courses
                </button>
                <h3 className='fw-bold text-dark mb-0'>{course?.title}</h3>
                <p className='text-muted small mb-0 mt-1'>
                    <i className="bi bi-calendar-event me-2"></i>
                    Valid: {course?.start_date?.split('T')[0]} — {course?.end_date?.split('T')[0]}
                </p>
            </div>
            {/* Progress Badge (Optional visual touch) */}
            <div className='bg-white px-4 py-2 rounded-3 shadow-sm text-center border'>
                <span className='d-block text-muted small fw-bold text-uppercase'>Total Lessons</span>
                <span className='fs-5 fw-bold text-primary'>{videos.length}</span>
            </div>
         </div>

         <div className='row g-4'>
            {/* --- 2. VIDEO PLAYER SECTION (LEFT) --- */}
            <div className='col-lg-8'>
                <div className='card shadow-lg border-0 overflow-hidden' style={{ borderRadius: '15px' }}>
                    {currentVideo ? (
                        <>
                            <div className="ratio ratio-16x9 bg-black">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${extractVideoId(currentVideo.url)}?autoplay=1&rel=0`} 
                                    title="Video Player" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className='card-body p-4'>
                                <h4 className='fw-bold mb-2'>{currentVideo.title}</h4>
                                <hr className='text-secondary opacity-25' />
                                <h6 className='fw-bold text-secondary text-uppercase small'>Description</h6>
                                <p className='text-muted mb-0' style={{ lineHeight: '1.6' }}>
                                    {currentVideo.description || "No description available for this lesson."}
                                </p>
                            </div>
                        </>
                    ) : (
                        // EMPTY STATE
                        <div className='ratio ratio-16x9 bg-light d-flex flex-column align-items-center justify-content-center text-center'>
                            <div style={{ zIndex: 10 }}>
                                <i className="bi bi-play-circle-fill text-primary opacity-50 display-1 mb-3"></i>
                                <h4 className='fw-bold text-secondary'>Ready to start learning?</h4>
                                <p className='text-muted'>Select a lesson from the playlist on the right.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- 3. PLAYLIST SECTION (RIGHT) --- */}
            <div className='col-lg-4'>
                <div className='card shadow-sm border-0' style={{ borderRadius: '15px', height: '100%' }}>
                    <div className='card-header bg-white py-3 border-bottom'>
                        <h5 className='mb-0 fw-bold'>
                            <i className="bi bi-collection-play me-2 text-primary"></i>
                            Course Content
                        </h5>
                    </div>
                    
                    <div className='list-group list-group-flush overflow-auto' style={{ maxHeight: '600px' }}>
                        {videos.map((video, index) => {
                            const isActive = currentVideo?.id === video.id;
                            return (
                                <button 
                                    key={video.id} 
                                    onClick={() => setCurrentVideo(video)}
                                    className={`list-group-item list-group-item-action p-3 border-0 border-bottom ${isActive ? 'bg-primary-subtle' : ''}`}
                                    style={{ transition: 'all 0.2s' }}
                                >
                                    <div className='d-flex align-items-start'>
                                        {/* Numbering / Icon */}
                                        <div className='me-3 mt-1'>
                                            {isActive ? (
                                                <i className="bi bi-play-circle-fill text-primary fs-5"></i>
                                            ) : (
                                                <span className='badge bg-light text-secondary rounded-circle border d-flex align-items-center justify-content-center' style={{ width: '25px', height: '25px' }}>
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Content */}
                                        <div className='flex-grow-1'>
                                            <h6 className={`mb-1 ${isActive ? 'fw-bold text-primary' : 'fw-semibold text-dark'}`}>
                                                {video.title}
                                            </h6>
                                            <small className='text-muted d-block'>
                                                <i className="bi bi-clock me-1"></i> Video Lesson
                                            </small>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                        
                        {videos.length === 0 && (
                            <div className='text-center py-5'>
                                <p className='text-muted'>No videos uploaded for this course yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default CourseVideos;