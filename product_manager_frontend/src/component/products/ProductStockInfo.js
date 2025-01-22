import React, {useState} from "react";

export function ProductStockInfo({handleShowQuantity, quantityInfo, product}) {
    const [showStockInfo, setShowStockInfo] = useState(false);
    return <div>
        <div className="flex justify-between w-full">
            <button
                onClick={() => {
                    handleShowQuantity(product.id)
                    setShowStockInfo((prev) => !prev)
                }}
                className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4 rounded-sm w-full"
            >
                See Stock Information
            </button>
        </div>

        {showStockInfo && quantityInfo && quantityInfo.product_id === product.id && (
            <div className="mt-4 bg-white border p-4 rounded-sm shadow-sm drop-shadow-sm">
                <h4 className="font-semibold">Stock Information</h4>
                <p className="text-gray-600"><span
                    className="font-medium">Initial Quantity:</span> {quantityInfo.initial_quantity}
                </p>
                <p className="text-gray-600"><span
                    className="font-medium">Sold Quantity:</span> {quantityInfo.sold_quantity}</p>
                <p className="text-gray-600">
                    <span className="font-medium">Current Quantity:</span>
                    {quantityInfo.current_quantity}</p>
            </div>
        )}
    </div>
}