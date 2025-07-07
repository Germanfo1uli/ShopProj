export const API_BASE_URL = 'http://localhost:5070';

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

    // Проверяем специальные случаи ответов без тела
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Если не удалось распарсить JSON, используем статус и текст ответа
        throw new ApiError(response.status, response.statusText);
      }
      throw new ApiError(response.status, errorData.message || 'Request failed');
    }

    try {
      return await response.json();
    } catch (e) {
      // Если ответ успешный, но не JSON, возвращаем как есть
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
export const fetchProducts = async (filter = 'all') => {
  try {
    const response = await apiRequest(`/api/products?filter=${filter}`);
    return response;
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    throw error;
  }
};

export const fetchRecommendedProducts = async () => {
  try {
    const response = await apiRequest('/api/products/recommended');
    return response;
  } catch (error) {
    console.error('Ошибка при загрузке рекомендуемых товаров:', error);
    throw error;
  }
};

export const fetchSpecialOffers = async () => {
  try {
    const response = await apiRequest('/api/products/special-offers');
    return response;
  } catch (error) {
    console.error('Ошибка при загрузке спецпредложений:', error);
    throw error;
  }
};