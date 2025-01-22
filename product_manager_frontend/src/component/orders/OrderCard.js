import React, {useContext} from 'react';
import {IS_NOT_SIMPLE_USER} from "../../utils/utils";
import {AuthContext} from "../../context/AuthContext";
import {getOrders as fetchOrders, updateOrder as updateOrderStatus} from "../../api/orders";

const OrderCard = ({order, setOrders, setError}) => {
    const {userRole} = useContext(AuthContext);
    const handleStatusUpdate = async (id, status) => {
        try {
            const updatedOrderData = {status};
            await updateOrderStatus(id, updatedOrderData);

            const refreshedOrders = await fetchOrders();
            setOrders(refreshedOrders);

            console.log('Order status updated successfully!');
        } catch (error) {
            setError('Failed to update order status');
        }
    };
    return (
        <div className="flex justify-between items-start bg-white p-4 rounded shadow">
            <div>
                <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
                {/*<p className="text-gray-600">Client: {order.client}</p>*/}
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
            </div>
            <div>
                {IS_NOT_SIMPLE_USER.includes(userRole) ? (
                    <div>
                        <select
                            className="p-2 border rounded text-blue-700"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ) : (
                    <p className="text-blue-700">{order.status}</p>
                )}
            </div>

        </div>
    );
};

export default OrderCard;
