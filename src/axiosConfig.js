import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/", // Adjust as needed
  withCredentials: true, // Allow sending cookies with requests
});

// Request interceptor (No need for Authorization header with cookies)
instance.interceptors.request.use((config) => {
  return config;
});

// Response interceptor to handle 403 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // Redirect to login page on unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
