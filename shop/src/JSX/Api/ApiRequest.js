import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    params = null,
    authenticated = false,
    headers = {}
  } = options;

  try {
    if (authenticated && !localStorage.getItem('authToken')) {
      console.warn('Запрос требует аутентификации, но токен не найден');
      throw new ApiError(401, 'Требуется аутентификация');
    }

    const response = await api({
      url: endpoint,
      method,
      data,
      params,
      headers
    });

    return response.data;

  } catch (error) {
    if (error.response) {
      // Ошибка от сервера
      const message = error.response.data?.message || 'Request failed';
      throw new ApiError(error.response.status, message);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      throw new ApiError(0, 'Ошибка сети: нет ответа от сервера');
    } else {
      // Ошибка при настройке запроса
      throw new ApiError(0, 'Ошибка при выполнении запроса');
    }
  }
};

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'Ошибка API';
  }
}

export default api;