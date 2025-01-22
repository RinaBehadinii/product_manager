import api from "./api";

export const login = async (username, password) => {
    const response = await api.post("/api/token/", username, password);
    return response.data;
};

export const register = async (username, email, password) => {
    const response = await api.post("/register/", username, email, password);
    return response.data;
};

export const refreshToken = async (refresh) => {
    const response = await api.post("/api/token/refresh/", {refresh});
    return response.data;
};
