import axios from 'axios';
import config from '../config';

export async function getAllVideos(token) {
  try { return (await axios.get(config.BASE_URL + '/video/all', { headers: { token } })).data; } 
  catch (ex) { return { status: 'error', error: ex.message }; }
}
export async function addVideo(courseId, title, url, description, token) {
  try { return (await axios.post(config.BASE_URL + '/video/add', { courseId, title, url, description }, { headers: { token } })).data; } 
  catch (ex) { return { status: 'error', error: ex.message }; }
}
export async function updateVideo(id, title, url, description, token) {
  try { return (await axios.put(config.BASE_URL + '/video/update/' + id, { title, url, description }, { headers: { token } })).data; } 
  catch (ex) { return { status: 'error', error: ex.message }; }
}
export async function deleteVideo(id, token) {
  try { return (await axios.delete(config.BASE_URL + '/video/delete/' + id, { headers: { token } })).data; } 
  catch (ex) { return { status: 'error', error: ex.message }; }
}