const API_BASE_URL = 'http://localhost:5000';

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET', // можно перезаписать при объявлении
    body = null, // можно перезаписать при объявлении
    headers = {}, // можно перезаписать при объявлении
    authenticated = false // можно перезаписать при объявлении
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
        }
    }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    return await response.json();
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


