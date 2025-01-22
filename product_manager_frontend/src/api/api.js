import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
    (config) => {
        const authTokens = localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null;

        if (authTokens?.access) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
