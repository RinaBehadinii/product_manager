import {IS_NOT_SIMPLE_USER, isSimpleUser} from "../../utils/utils";
import React, {useContext, useState} from "react";
import {deleteProduct} from "../../api/products";
import {AuthContext} from "../../context/AuthContext";

export function DisplayProduct({product, onRefreshProducts, setIsEditing, addToOrder, addingProduct}) {
    const {userRole, authTokens} = useContext(AuthContext)
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [orderQuantity, setOrderQuantity] = useState(1);

    const handleDelete = async () => {
        try {
            await deleteProduct(product.id, authTokens);
            onRefreshProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const discountedPrice =
        product.price - product.discount > 0
            ? product.price - product.discount
            : 0;

    const handleAddToOrder = () => {
        if (isSimpleUser(userRole)) {
            addToOrder({...product, quantity: orderQuantity});
        }
    };

    return <>
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-gray-600">
            <span className="font-medium">Description:</span> {product.description}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Price:</span> ${product.price}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Price After Discount:</span> ${discountedPrice}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Discount:</span> ${product.discount}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Quantity:</span> {product.quantity}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Category:</span> {product.category}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Brand:</span> {product.brand}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Size:</span> {product.size}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Color:</span> {product.color}
        </p>
        <p className="text-gray-600">
            <span className="font-medium">Gender:</span> {product.gender}
        </p>
        {IS_NOT_SIMPLE_USER.includes(userRole) && (
            <>
                {confirmDelete ? (
                    <div className="mt-4">
                        <p className="text-red-500">
                            Are you sure you want to delete this product?
                        </p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={handleDelete}
                                className="bg-red-400 border border-red-500 text-white px-4 rounded-sm shadow-sm drop-shadow-sm"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="bg-gray-400 border border-gray-500 text-white px-4 rounded-sm shadow-sm drop-shadow-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex justify-self-end space-x-2">
                        <button
                            disabled={addingProduct}
                            onClick={() => setIsEditing(true)}
                            className={`${addingProduct ? 'bg-gray-300 border-gray-400' : "bg-blue-400 border-blue-500 "} border text-white px-2 rounded-sm shadow-sm drop-shadow-sm`}
                        >
                            Edit
                        </button>
                        <button
                            disabled={addingProduct}
                            onClick={() => setConfirmDelete(true)}
                            className={`${addingProduct ? 'bg-gray-300 border-gray-400' : "bg-red-400 border-red-500"}  border text-white px-4 rounded-sm shadow-sm drop-shadow-sm`}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </>
        )}
        {isSimpleUser(userRole) && (
            <div className="mt-4 flex flex-col items-start justify-end w-full">
                <label className="text-gray-800 text-xs mb-1">Quantity</label>
                <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    min="1"
                    max={product.quantity}
                    className="border rounded-sm w-16 pl-2"
                />
                <button
                    disabled={product.quantity <= 0}
                    onClick={handleAddToOrder}
                    className={`${product.quantity <= 0 ? "bg-gray-300 border-gray-400" : "bg-lime-500 border-lime-600"} border text-white px-4 mt-2 rounded-sm shadow-sm drop-shadow-sm`}
                >
                    Add to Order
                </button>
            </div>
        )}
    </>
}