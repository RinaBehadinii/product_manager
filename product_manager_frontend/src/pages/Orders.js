import React, {useState, useEffect, useContext} from 'react';
import {getOrders as fetchOrders, updateOrder as updateOrderStatus} from '../api/orders';
import OrderCard from "../component/orders/OrderCard";
import {AuthContext} from '../context/AuthContext';
import {IS_NOT_SIMPLE_USER} from "../utils/utils";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders');
            }
        };

        loadOrders();
    }, []);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-blue-950 text-2xl font-bold mb-6">Orders</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-4">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} setOrders={setOrders} setError={setError}/>
                ))}
            </div>
        </div>
    );
};

export default Orders;
