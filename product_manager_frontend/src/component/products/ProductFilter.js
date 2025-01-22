import React, {useState} from 'react';
import {FILTERS_INITIAL_VALUES} from "../../utils/utils";

const ProductFilter = ({onFilter, filterOptions}) => {
    const [filters, setFilters] = useState(FILTERS_INITIAL_VALUES);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleClearFilters = () => {
        const clearedFilters = FILTERS_INITIAL_VALUES;
        setFilters(clearedFilters);
        onFilter(clearedFilters);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-200 border border-gray-300 p-4 shadow-sm drop-shadow-sm rounded-sm space-y-4"
        >
            <h1 className="text-blue-950 text-xl font-bold mb-2 mt-1">Product Filters</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Category</option>
                    {filterOptions?.categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="brand"
                    value={filters.brand}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Brand</option>
                    {filterOptions?.brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>
                            {brand.name}
                        </option>
                    ))}
                </select>
                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Gender</option>
                    {filterOptions?.genders.map((gender) => (
                        <option key={gender.id} value={gender.type}>
                            {gender.type}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="price_min"
                    placeholder="Min Price"
                    value={filters.price_min}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="price_max"
                    placeholder="Max Price"
                    value={filters.price_max}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <select
                    name="size"
                    value={filters.size}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Size</option>
                    {filterOptions?.sizes.map((size) => (
                        <option key={size.id} value={size.size}>
                            {size.size}
                        </option>
                    ))}
                </select>
                <select
                    name="color"
                    value={filters.color}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select Color</option>
                    {filterOptions?.colors.map((color) => (
                        <option key={color.id} value={color.name}>
                            {color.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="submit"
                    className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4  rounded-sm"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="bg-gray-400 border border-gray-500 shadow-sm drop-shadow-sm text-white px-4  rounded-sm"
                >
                    Clear Filters
                </button>
            </div>
        </form>
    );
};

export default ProductFilter;
