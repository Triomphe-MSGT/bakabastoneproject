import api from './api';

const createMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

const getMessageById = async (id) => {
  const response = await api.get(`/messages/${id}`);
  return response.data;
};

const deleteMessage = async (id) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

const markAsRead = async (id) => {
  const response = await api.put(`/messages/${id}/read`);
  return response.data;
};

const messageService = {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  markAsRead
};

export default messageService;
