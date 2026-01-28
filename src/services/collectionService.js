import api from './api';

const getAllCollections = async () => {
  const response = await api.get('/collections');
  return response.data;
};

const getCollectionById = async (id) => {
  const response = await api.get(`/collections/${id}`);
  return response.data;
};

const createCollection = async (collectionData) => {
  const response = await api.post('/collections', collectionData);
  return response.data;
};

const updateCollection = async (id, collectionData) => {
  const response = await api.put(`/collections/${id}`, collectionData);
  return response.data;
};

const deleteCollection = async (id) => {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
};

const collectionService = {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};

export default collectionService;
