import React from "react";

export function EditProduct({
                                editedProduct,
                                handleEditChange,
                                filterOptions,
                                handleSave,
                                setIsEditing,
                                setAddingProduct,
                                addingProduct
                            }) {
    return <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
            className="border p-2 w-full mb-2 rounded"
            name="name"
            value={editedProduct.name}
            onChange={handleEditChange}
        />
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
            className="border p-2 w-full mb-2 rounded"
            name="description"
            value={editedProduct.description}
            onChange={handleEditChange}
        />
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
            className="border p-2 w-full mb-2 rounded"
            name="price"
            type="number"
            value={editedProduct.price}
            onChange={handleEditChange}
        />
        <label className="block text-sm font-medium mb-1">Discount</label>
        <input
            className="border p-2 w-full mb-2 rounded"
            name="discount"
            type="number"
            value={editedProduct.discount}
            onChange={handleEditChange}
        />
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <input
            className="border p-2 w-full mb-2 rounded"
            name="quantity"
            type="number"
            value={editedProduct.quantity}
            onChange={handleEditChange}
        />
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
            name="category"
            value={editedProduct.category}
            onChange={handleEditChange}
            className="border p-2 w-full mb-2 rounded"
        >
            <option value="">Select Category</option>
            {filterOptions?.categories.map((category) => (
                <option key={category.id} value={category.name}>
                    {category.name}
                </option>
            ))}
        </select>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <select
            name="brand"
            value={editedProduct.brand}
            onChange={handleEditChange}
            className="border p-2 w-full mb-2 rounded"
        >
            <option value="">Select Brand</option>
            {filterOptions?.brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                    {brand.name}
                </option>
            ))}
        </select>
        <label className="block text-sm font-medium mb-1">Color</label>
        <select
            name="color"
            value={editedProduct.color}
            onChange={handleEditChange}
            className="border p-2 w-full mb-2 rounded"
        >
            <option value="">Select Color</option>
            {filterOptions?.colors.map((color) => (
                <option key={color.id} value={color.name}>
                    {color.name}
                </option>
            ))}
        </select>
        <label className="block text-sm font-medium mb-1">Size</label>
        <select
            name="size"
            value={editedProduct.size}
            onChange={handleEditChange}
            className="border p-2 w-full mb-2 rounded"
        >
            <option value="">Select Size</option>
            {filterOptions?.sizes.map((size) => (
                <option key={size.id} value={size.size}>
                    {size.size}
                </option>
            ))}
        </select>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <select
            name="gender"
            value={editedProduct.gender}
            onChange={handleEditChange}
            className="border p-2 w-full mb-2 rounded"
        >
            <option value="">Select Gender</option>
            {filterOptions?.genders.map((gender) => (
                <option key={gender.id} value={gender.type}>
                    {gender.type}
                </option>
            ))}
        </select>
        <button
            disabled={addingProduct}
            onClick={handleSave}
            className={`${addingProduct ? "bg-gray-300 border-gray-300" : "bg-blue-400 border-blue-500"} border text-white px-2 mr-2 rounded-sm shadow-sm drop-shadow-sm`}
        >
            Save
        </button>
        <button
            disabled={addingProduct}
            onClick={() => {
                setIsEditing(false)
                setAddingProduct(false)
            }}
            className={`${addingProduct ? "bg-gray-300 border-gray-300" : "bg-gray-400  border-gray-500"}  border text-white px-4 rounded-sm shadow-sm drop-shadow-sm`}
        >
            Cancel
        </button>
    </div>
}