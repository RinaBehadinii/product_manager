import React, {useContext, useState, useEffect} from 'react';
import {IS_NOT_SIMPLE_USER} from "../../utils/utils";
import {AuthContext} from "../../context/AuthContext";
import {getClients} from "../../api/clients";

const OrderFilters = ({onFilter}) => {
    const [filters, setFilters] = useState({
        status: '',
        user: '',
        start_date: '',
        end_date: ''
    });
    const [users, setUsers] = useState([]);

    const {userRole} = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const clients = await getClients();
                const simpleUsers = clients.filter(client => client.groups.includes("Simple User"));
                setUsers(simpleUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (IS_NOT_SIMPLE_USER.includes(userRole)) {
            fetchUsers();
        }
    }, [userRole]);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            status: '',
            user: '',
            start_date: '',
            end_date: ''
        };
        setFilters(clearedFilters);
        onFilter(clearedFilters);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-200 border border-gray-300 p-4 shadow-sm drop-shadow-sm rounded-sm space-y-4"
        >
            <h1 className="text-blue-950 text-xl font-bold mb-2 mt-1">Order Filters</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>

                {IS_NOT_SIMPLE_USER.includes(userRole) && (
                    <select
                        name="user"
                        value={filters.user}
                        onChange={handleChange}
                        className="p-2 border rounded"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                )}

                <input
                    type="date"
                    name="start_date"
                    placeholder="Start Date"
                    value={filters.start_date}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                <input
                    type="date"
                    name="end_date"
                    placeholder="End Date"
                    value={filters.end_date}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="submit"
                    className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4 rounded-sm"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="bg-gray-400 border border-gray-500 shadow-sm drop-shadow-sm text-white px-4 rounded-sm"
                >
                    Clear Filters
                </button>
            </div>
        </form>
    );
};

export default OrderFilters;
