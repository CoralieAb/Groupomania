import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/user/';

class UserService {
  deleteAccount(userId) {
    return axios.delete(API_URL + userId, {
      headers: authHeader(),
      data: {
        userId: userId
      }
    });
  }
  getUserProfile(userId) {
    return axios.get(API_URL + userId, { headers: authHeader() });
  }
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();