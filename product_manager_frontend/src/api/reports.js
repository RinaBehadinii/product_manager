import api from "./api";

export const fetchDailyEarnings = async () => {
    const response = await api.get('reports/daily_earnings/');
    return response.data;
};

export const fetchTopSellingProducts = async () => {
    const response = await api.get('reports/top_selling_products/');
    return response.data;
};
