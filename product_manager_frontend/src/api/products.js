import api from "./api";

export const searchProducts = async (params) => {
    const response = await api.get("/products/search/", {params});
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post("/products/", productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}/`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
};

export const getProductQuantity = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/quantity/`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching product quantity: ' + error.message);
    }
};
