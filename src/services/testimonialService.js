import api from './api';

const getFeaturedTestimonials = async () => {
  constresponse = await api.get('/testimonials/featured');
  return response.data;
};

const getAllTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

const createTestimonial = async (testimonialData) => {
  const response = await api.post('/testimonials', testimonialData);
  return response.data;
};

const updateTestimonial = async (id, testimonialData) => {
  const response = await api.put(`/testimonials/${id}`, testimonialData);
  return response.data;
};

const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};

const toggleApproval = async (id) => {
  const response = await api.patch(`/testimonials/${id}/approve`);
  return response.data;
};

const toggleFeatured = async (id) => {
  const response = await api.patch(`/testimonials/${id}/feature`);
  return response.data;
};

const testimonialService = {
  getFeaturedTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleApproval,
  toggleFeatured
};

export default testimonialService;
