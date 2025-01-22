import api from "./api";

export const getClients = async () => {
    const response = await api.get("/users/");
    return response.data;
};

export const updateClientRole = async (userId, newRole) => {
    const response = await api.patch(`/users/${userId}/`, {groups: [newRole]});
    return response.data;
};
