import React, {useState, useEffect} from "react";
import {
    getCategories,
    getBrands,
    getGenders,
    getSizes,
    getColors,
} from "../api/filters";
import api from "../api/api";

const Filters = () => {
    const [filters, setFilters] = useState([]);
    const [selectedFilterType, setSelectedFilterType] = useState("categories");
    const [newFilterValue, setNewFilterValue] = useState("");
    const [editValues, setEditValues] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFilters(selectedFilterType);
    }, [selectedFilterType]);

    const loadFilters = async (type) => {
        try {
            let data;
            switch (type) {
                case "categories":
                    data = await getCategories();
                    break;
                case "brands":
                    data = await getBrands();
                    break;
                case "genders":
                    data = await getGenders();
                    break;
                case "sizes":
                    data = await getSizes();
                    break;
                case "colors":
                    data = await getColors();
                    break;
                default:
                    data = [];
            }
            setFilters(data);
        } catch (err) {
            setError("Error loading filters");
        }
    };

    const handleCreate = async () => {
        if (!newFilterValue) return;
        try {
            const payload =
                selectedFilterType === "genders"
                    ? {type: newFilterValue}
                    : selectedFilterType === "sizes"
                        ? {size: newFilterValue}
                        : {name: newFilterValue};

            await api.post(`/${selectedFilterType}/`, payload);
            setNewFilterValue("");
            loadFilters(selectedFilterType);
        } catch (err) {
            setError("Error creating filter");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/${selectedFilterType}/${id}/`);
            loadFilters(selectedFilterType);
        } catch (err) {
            setError("Error deleting filter");
        }
    };

    const handleUpdate = async (id) => {
        if (!editValues[id]) return;
        try {
            const payload =
                selectedFilterType === "genders"
                    ? {type: editValues[id]}
                    : selectedFilterType === "sizes"
                        ? {size: editValues[id]}
                        : {name: editValues[id]};

            await api.put(`/${selectedFilterType}/${id}/`, payload);
            setEditValues((prev) => ({...prev, [id]: ""}));
            setEditingId(null);
            loadFilters(selectedFilterType);
        } catch (err) {
            setError("Error updating filter");
        }
    };

    const getDisplayValue = (item) => {
        if (selectedFilterType === "genders") return item.type;
        if (selectedFilterType === "sizes") return item.size;
        return item.name;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-blue-950 text-3xl font-bold mb-6">Filters</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <label htmlFor="filter-type" className="block text-gray-700 font-bold mb-2">
                    Select Filter Type
                </label>
                <select
                    id="filter-type"
                    value={selectedFilterType}
                    onChange={(e) => setSelectedFilterType(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="categories">Categories</option>
                    <option value="brands">Brands</option>
                    <option value="genders">Genders</option>
                    <option value="sizes">Sizes</option>
                    <option value="colors">Colors</option>
                </select>

                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder={`Add new ${selectedFilterType}`}
                        value={newFilterValue}
                        onChange={(e) => setNewFilterValue(e.target.value)}
                        className="p-2 text-sm border rounded flex-grow"
                    />
                </div>
                <div className="flex justify-end mt-4 -mr-2">
                    <button
                        onClick={handleCreate}
                        className="bg-blue-400 border-blue-500 border text-white px-2 mr-2 rounded-sm shadow-sm drop-shadow-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-blue-950 text-2xl font-bold text-gray-900 mb-4 capitalize">
                    {selectedFilterType}
                </h2>

                <ul className="grid grid-cols-1 gap-4">
                    {filters.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2">
                            {editingId === item.id ? (
                                <>
                                    <input
                                        type="text"
                                        defaultValue={getDisplayValue(item)}
                                        onChange={(e) =>
                                            setEditValues((prev) => ({...prev, [item.id]: e.target.value}))
                                        }
                                        className="p-2 border rounded flex-grow mr-2"
                                    />
                                    <button
                                        onClick={() => handleUpdate(item.id)}
                                        className="bg-lime-500 border border-lime-600 text-white w-20 rounded-sm shadow-sm drop-shadow-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-400 border border-gray-500 shadow-sm drop-shadow-sm text-white w-20 rounded-sm"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-grow text-gray-800 ml-1">{getDisplayValue(item)}</span>
                                    <button
                                        onClick={() => setEditingId(item.id)}
                                        className="bg-blue-400 border-blue-500 border text-white w-20 rounded-sm shadow-sm drop-shadow-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 border text-white w-20 rounded-sm shadow-sm drop-shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Filters;
