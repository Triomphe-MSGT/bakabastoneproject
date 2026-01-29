import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/profile/password', passwordData);
  return response.data;
};

const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

const authService = {
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword
};

export default authService;
