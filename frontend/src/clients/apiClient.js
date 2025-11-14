import axios from "axios";
import useUiStore from "../stores/uiStore.js";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://i-know-what-we-do-today.onrender.com/api"
    : "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    useUiStore.getState().startRequest();

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useUiStore.getState().endRequest();
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    useUiStore.getState().endRequest();
    return response;
  },
  (error) => {
    useUiStore.getState().endRequest();
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
