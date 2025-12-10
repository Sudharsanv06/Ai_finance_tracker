import api from './api';

export const categorizeExpense = async (data) => {
  const response = await api.post('/ai/categorize', data);
  return response.data;
};

export const generateInsight = async () => {
  const response = await api.post('/ai/insights');
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/ai/insights');
  return response.data;
};

export const askQuestion = async (question) => {
  const response = await api.post('/ai/ask', { question });
  return response.data;
};
