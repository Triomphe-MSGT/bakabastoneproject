import api from './api';

const getAllExpertise = async () => {
  const response = await api.get('/expertise');
  return response.data;
};

const getActiveExpertise = async () => {
  const response = await api.get('/expertise/active');
  return response.data;
};

const getExpertiseById = async (id) => {
  // Assuming basic CRUD, though usually expertise might be simpler
  // Based on admin manager, it likely has ID based operations
  const response = await api.get(`/expertise/${id}`); 
  return response.data;
};

const createExpertise = async (expertiseData) => {
  const response = await api.post('/expertise', expertiseData);
  return response.data;
};

const updateExpertise = async (id, expertiseData) => {
  const response = await api.put(`/expertise/${id}`, expertiseData);
  return response.data;
};

const deleteExpertise = async (id) => {
  const response = await api.delete(`/expertise/${id}`);
  return response.data;
};

const expertiseService = {
  getAllExpertise,
  getActiveExpertise,
  getExpertiseById,
  createExpertise,
  updateExpertise,
  deleteExpertise
};

export default expertiseService;
