import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not set. API calls will likely fail.");
}

// 1. Create the Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add a Request Interceptor (Placeholder for JWT logic)
// This fulfills the blueprint requirement to use an Interceptor.
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

// We will add a Response Interceptor here later for error handling.

export default apiClient;
