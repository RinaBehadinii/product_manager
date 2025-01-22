import React, {useState} from "react";

export function OrderSummary({placeOrder, selectedOrderItems, removeFromOrder}) {
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    return <>
        <div className="mb-6 mt-6 flex items-center">
            <div className="flex items-center gap-2">
                <h2 className="text-blue-950 text-xl font-bold">Current Order Summary</h2>
                <button
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="bg-blue-400 border border-blue-500 shadow-sm drop-shadow-sm text-white px-4  rounded-sm"
                >
                    {showOrderSummary ? 'Hide' : 'Show'}
                </button>
            </div>
            <div>
                <button
                    onClick={placeOrder}
                    disabled={selectedOrderItems.length === 0}
                    className={`ml-4 ${selectedOrderItems.length === 0 ? 'bg-gray-300 border-gray-400' : 'bg-lime-500 border-lime-600'}  border  shadow-sm drop-shadow-sm text-white px-4  rounded-sm`}
                >
                    Place Order
                </button>
            </div>
        </div>
        {showOrderSummary && (
            <div className="bg-white p-4 rounded-sm shadow-sm drop-shadow-sm mb-6">
                {selectedOrderItems.length > 0 ? (
                    <div>
                        <ul className="space-y-2">
                            {selectedOrderItems.map((item) => (
                                <li key={item?.id} className="flex justify-between items-center">
                                    <span className="font-medium">{item?.name}</span>{item?.quantity} x ${item?.price} =
                                    $
                                    {item?.quantity * item?.price}
                                    <button
                                        onClick={() => {
                                            removeFromOrder(item.id)
                                            setShowOrderSummary(false)
                                        }}
                                        className="bg-red-400 border border-red-500 text-white px-4 rounded-sm shadow-sm drop-shadow-sm"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">No products added yet.</p>
                )}
            </div>
        )}
    </>
}