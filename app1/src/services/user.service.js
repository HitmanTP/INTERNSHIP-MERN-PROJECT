import axios from 'axios';
import config from '../config';


export async function changePassword(oldPassword, newPassword, token) {
  const URL = config.BASE_URL + '/user/change-password';
  const body = { oldPassword, newPassword };
  const headers = { token };

  try {
    const response = await axios.put(URL, body, { headers });
    return response.data;
  } catch (ex) {
    return { status: 'error', error: ex.message };
  }
}

// LOGIN
export async function loginUser(email, password) {
  const URL = config.BASE_URL + '/user/signin';
  const body = { email, password };

  try {
    const response = await axios.post(URL, body);
    return response.data;
  } catch (ex) {
    return { status: 'error', error: ex.message };
  }
}

// REGISTER
export async function registerUser(name, email, password, mobile) {
  const URL = config.BASE_URL + '/user/signup';
  const body = { name, email, password, mobile };

  try {
    const response = await axios.post(URL, body);
    return response.data;
  } catch (ex) {
    return { status: 'error', error: ex.message };
  }
}

// GET PROFILE
export async function getUserProfile(token) {
  const URL = config.BASE_URL + '/user/profile';
  const headers = { token };

  try {
    const response = await axios.get(URL, { headers });
    return response.data;
  } catch (ex) {
    return { status: 'error', error: ex.message };
  }
}

// UPDATE PROFILE
export async function updateProfile(token, mobile) {
  const URL = config.BASE_URL + '/user/profile';
  const headers = { token };
  const body = { mobile };

  try {
    const response = await axios.put(URL, body, { headers });
    return response.data;
  } catch (ex) {
    return { status: 'error', error: ex.message };
  }
}
