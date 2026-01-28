import api from './api';

const uploadFile = async (formData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const uploadService = {
  uploadFile
};

export default uploadService;
