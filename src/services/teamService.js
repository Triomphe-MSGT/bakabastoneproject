import api from './api';

const getAllTeamMembers = async () => {
  const response = await api.get('/team');
  return response.data;
};

const createTeamMember = async (teamData) => {
  const response = await api.post('/team', teamData);
  return response.data;
};

const updateTeamMember = async (id, teamData) => {
  const response = await api.put(`/team/${id}`, teamData);
  return response.data;
};

const deleteTeamMember = async (id) => {
  const response = await api.delete(`/team/${id}`);
  return response.data;
};

const teamService = {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};

export default teamService;
