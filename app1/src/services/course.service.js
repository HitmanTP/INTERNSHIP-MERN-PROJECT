import axios from 'axios';
import config from '../config';

export async function getAllCourses(token) {
  try { return (await axios.get(config.BASE_URL + '/course/all-courses', { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
}

// export async function addCourse(title, description, price, startDate, endDate, image, expireDays, token) {
//   const body = { title, description, price, startDate, endDate, image, expireDays };
//   try { return (await axios.post(config.BASE_URL + '/course/add', body, { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
// }

// ... existing imports

// ADD THIS NEW FUNCTION
export async function getActiveCourses() {
  try { 
    // This calls the public route we created earlier
    const response = await axios.get(config.BASE_URL + '/course/all-active-courses');
    return response.data; 
  } catch (ex) { 
    return { status: 'error', error: ex.message }; 
  }
}

// ... existing functions (getAllCourses, addCourse, etc.)


// Update arguments to accept both file and url
export async function addCourse(title, description, price, startDate, endDate, imageFile, imageUrl, expireDays, token) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('startDate', startDate);
  formData.append('endDate', endDate);
  formData.append('expireDays', expireDays);
  
  // Only append file if it exists
  if (imageFile) {
      formData.append('image', imageFile);
  }
  // Always append URL (it might be empty string, which is fine)
  formData.append('imageUrl', imageUrl);

  try { 
      const response = await axios.post(config.BASE_URL + '/course/add', formData, { headers: { token } });
      return response.data;
  } catch (ex) { 
      return { status: 'error', error: ex.message }; 
  }
}


export async function updateCourse(id, title, description, price, startDate, endDate, image, expireDays, token) {
  const body = { title, description, price, startDate, endDate, image, expireDays };
  try { return (await axios.put(config.BASE_URL + '/course/update/' + id, body, { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
}

export async function deleteCourse(id, token) {
  try { return (await axios.delete(config.BASE_URL + '/course/delete/' + id, { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
}

export async function enrollCourse(courseId, token) {
  try { return (await axios.post(config.BASE_URL + '/student/register-to-course', { courseId }, { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
}

// --- NEW FUNCTION ADDED ---
export async function getMyCourses(token) {
  try { return (await axios.get(config.BASE_URL + '/student/my-courses', { headers: { token } })).data; } catch (ex) { return { status: 'error', error: ex.message }; }
}