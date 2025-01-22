import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {isAdmin, isAdvancedUser, isSimpleUser} from "../utils/utils";

const Dashboard = () => {
    const {userRole} = useContext(AuthContext);

    return (
        <div className="min-h-screen min-w-[100vh] p-6 bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="mb-4">Welcome to your dashboard, <strong>{userRole}</strong>.</p>

                {isAdmin(userRole) && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Admin Actions</h2>
                        <ul className="list-disc list-inside">
                            <li>Manage Users</li>
                            <li>View Reports</li>
                            <li>Manage Discounts</li>
                        </ul>
                    </div>
                )}

                {isAdvancedUser(userRole) && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Advanced User Actions</h2>
                        <ul className="list-disc list-inside">
                            <li>View Reports</li>
                            <li>Manage Products</li>
                        </ul>
                    </div>
                )}

                {isSimpleUser(userRole) && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Simple User Actions</h2>
                        <ul className="list-disc list-inside">
                            <li>View Products</li>
                            <li>Place Orders</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
