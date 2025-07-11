export const API_BASE_URL = 'http://localhost:5000';

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    authenticated = false
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (authenticated) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Запрос требует аутентификации, но токен не найден');
      throw new ApiError(401, 'Требуется аутентификация');
    }
  }

  if (body && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        throw new ApiError(response.status, response.statusText);
      }
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    try {
      return await response.json();
    } catch (e) {
      
      return response;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Ошибка API ${error.status}: ${error.message}`);
      throw error;
    } else {
      console.error('Ошибка сети:', error);
      throw new ApiError(0, 'Ошибка сети');
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