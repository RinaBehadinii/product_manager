import api from './api';

export const getCategories = async () => {
    const response = await api.get('/categories/');
    return response.data;
};

export const getBrands = async () => {
    const response = await api.get('/brands/');
    return response.data;
};

export const getGenders = async () => {
    const response = await api.get('/genders/');
    return response.data;
};

export const getSizes = async () => {
    const response = await api.get('/sizes/');
    return response.data;
};

export const getColors = async () => {
    const response = await api.get('/colors/');
    return response.data;
};
