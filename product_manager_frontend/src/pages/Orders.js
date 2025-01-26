import React, {useState, useEffect, useContext} from 'react';
import {getOrders as fetchOrders} from '../api/orders';
import OrderCard from "../component/orders/OrderCard";
import {AuthContext} from '../context/AuthContext';
import OrderFilters from "../component/orders/OrderFilters";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({});
    const [error, setError] = useState('');

    const fetchFilteredOrders = async () => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== "" && value !== null && value !== undefined)
        );

        try {
            const fetchedOrders = await fetchOrders(validFilters);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Error fetching orders');
        }
    };

    useEffect(() => {
        fetchFilteredOrders();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-blue-950 text-2xl font-bold mb-6">Orders</h1>

            <OrderFilters onFilter={handleFilterChange}/>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {orders.length === 0 && !error && (
                <p className="text-center text-gray-500 mt-8">No Orders to Show</p>
            )}

            <div className="space-y-4 mt-8 overflow-y-auto h-96">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} setOrders={setOrders} setError={setError}/>
                ))}
            </div>
        </div>
    );
};

export default Orders;
