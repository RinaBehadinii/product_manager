import React, {useState, useEffect} from 'react';
import {getClients as fetchClients, updateClientRole} from '../api/clients';
import {USER_ROLES} from "../utils/utils";

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadClients = async () => {
            try {
                const fetchedClients = await fetchClients();
                setClients(fetchedClients);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        loadClients();
    }, []);

    const handleRoleChange = async (clientId, newRole) => {
        try {
            setLoading(true);
            await updateClientRole(clientId, newRole);
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.id === clientId
                        ? {...client, groups: [newRole]}
                        : client
                )
            );
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-blue-950 text-2xl font-bold mb-6">Clients</h1>
            <div className="flex flex-col gap-4">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="bg-white border border-gray-100 px-4 py-2 rounded shadow-md drop-shadow-md"
                    >
                        <p className="text-gray-600">
                            <b>Username:</b> {client.username}
                        </p>
                        <p className="text-gray-600">
                            <b>Email:</b> {client.email}
                        </p>

                        <div className="flex items-center space-x-4 mt-2">
                            <p className="text-gray-600">
                                <b>Role:</b>
                            </p>
                            {USER_ROLES.map((role) => (
                                <label
                                    key={`${client.id}-${role}`}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="radio"
                                        name={`role-${client.id}`}
                                        value={role}
                                        checked={client.groups[0] === role}
                                        onChange={() =>
                                            handleRoleChange(client.id, role)
                                        }
                                        disabled={loading}
                                        className="form-radio"
                                    />
                                    <span className="text-gray-700">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clients;
