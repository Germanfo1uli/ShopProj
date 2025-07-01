const API_BASE_URL = 'http://localhost:5000';

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET', // можно перезаписать при объявлении
    body = null, // можно перезаписать при объявлении
    headers = {}, // можно перезаписать при объявлении
    authenticated = false // можно перезаписать при объявлении
  } = options;

  // Формируем полный URL
  const url = `${API_BASE_URL}${endpoint}`;

  // Подготавливаем конфигурацию запроса
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  // Добавляем токен авторизации если требуется
  if (authenticated) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Добавляем тело запроса если есть
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

// // Примеры конкретных методов API
// export const api = {
//   
//   login: (credentials) => apiRequest('/auth/login', {
//     method: 'POST',
//     body: credentials
//   }),
//   
//   getProducts: () => apiRequest('/products', { authenticated: true }),
//   
//   createProduct: (productData) => apiRequest('/products', {
//     method: 'POST',
//     body: productData,
//     authenticated: true
//   }),
//   
//   updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
//     method: 'PUT',
//     body: productData,
//     authenticated: true
//   }),
//   
//   deleteProduct: (id) => apiRequest(`/products/${id}`, {
//     method: 'DELETE',
//     authenticated: true
//   })
//}

