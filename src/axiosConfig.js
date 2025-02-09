// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/",
});

// Request interceptor to add the Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 403 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Clear the token from localStorage
      localStorage.removeItem("token");
      // Redirect to the login page
      window.location.href = "/login";
      // Alternatively, if using React Router's useNavigate:
      // const navigate = useNavigate();
      // navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default instance;
