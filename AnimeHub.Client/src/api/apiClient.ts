import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT
  ? Number(import.meta.env.VITE_API_TIMEOUT)
  : 30000; // Default to 30 seconds if not set

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not set. API calls will likely fail.");
}

// 1. Create the Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (JWT Injection)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      // Ensure the Authorization header is set for secured endpoints
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Remove header if no token is present
      delete config.headers.Authorization;
    }

    // For file uploads (FormData), remove the default Content-Type header
    // Axios sets config.data to an instance of FormData for file uploads.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (Expired or invalid token)
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - clearing token and redirecting.");
      localStorage.removeItem("jwtToken");
      // Optional: window.location.href = '/login';
    }

    // You can also standardize the error object here so your
    // components always receive a consistent structure.
    return Promise.reject(error);
  }
);

export default apiClient;
