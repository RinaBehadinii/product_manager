import React, {useState, useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {updateProduct, createProduct} from '../../api/products';
import {INITIAL_EDITABLE_PRODUCT} from "../../utils/utils";
import {EditProduct} from "./EditProduct";
import {DisplayProduct} from "./DisplayProduct";

const ProductCard = ({
                         product,
                         onRefreshProducts,
                         isNew,
                         filterOptions,
                         addToOrder,
                         setAddingProduct,
                         addingProduct
                     }) => {
    const {authTokens} = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [editedProduct, setEditedProduct] = useState(
        isNew
            ? INITIAL_EDITABLE_PRODUCT
            : {...product}
    );
    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditedProduct({...editedProduct, [name]: value});
    };

    const handleSave = async () => {
        try {
            if (isNew) {
                await createProduct(editedProduct, authTokens);
            } else {
                await updateProduct(product.id, editedProduct, authTokens);
            }
            onRefreshProducts();
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const cardClass = product?.quantity <= 0
        ? 'bg-gray-200 border-2 border-gray-300 p-4 rounded-sm shadow-sm drop-shadow-sm'
        : 'bg-white border p-4 rounded-sm shadow-sm drop-shadow-sm';

    return (
        <div className={cardClass}>
            {isEditing ? (
                <EditProduct editedProduct={editedProduct}
                             handleEditChange={handleEditChange}
                             filterOptions={filterOptions}
                             handleSave={handleSave}
                             isEditing={isEditing}
                             setIsEditing={setIsEditing}
                             setAddingProduct={setAddingProduct}
                             addingProduct={addingProduct}
                />
            ) : (
                <DisplayProduct onRefreshProducts={onRefreshProducts} product={product} addToOrder={addToOrder}
                                setIsEditing={setIsEditing} addingProduct={addingProduct}
                />
            )}
        </div>
    );
};

export default ProductCard;
