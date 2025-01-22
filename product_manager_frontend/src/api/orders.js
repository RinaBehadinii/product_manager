import api from "./api";

const baseUrl = "/orders/";

export const getOrders = async () => {
    try {
        const response = await api.get(baseUrl);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching orders: ' + error.message);
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(baseUrl, orderData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating order: ' + error.message);
    }
};

export const updateOrder = async (orderId, orderData) => {
    try {
        const response = await api.patch(`${baseUrl}${orderId}/`, orderData);
        return response.data;
    } catch (error) {
        throw new Error(`Error updating order with ID ${orderId}: ` + error.message);
    }
};