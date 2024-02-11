import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 5000,
  withCredentials: true
});

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // If the response is successful, return it as is
    return response;
  },
  (error) => {
    // If the response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear the JWT token from localStorage
      localStorage.removeItem("jwt");
      // Redirect to the login page
      window.location.href = "/login"; // Adjust the URL as needed
    }
    // If the error is not a 401, return the error
    return Promise.reject(error);
  }
);

export default instance;
