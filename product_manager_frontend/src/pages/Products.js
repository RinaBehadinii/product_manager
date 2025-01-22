import React, {useState, useEffect, useContext} from 'react';
import {getProductQuantity, searchProducts} from '../api/products';
import {getCategories, getBrands, getGenders, getSizes, getColors} from '../api/filters';
import ProductCard from "../component/products/ProductCard";
import ProductFilter from "../component/products/ProductFilter";
import {AuthContext} from "../context/AuthContext";
import {FILTER_OPTIONS_INITIAL_VALUES, IS_NOT_SIMPLE_USER, isSimpleUser} from "../utils/utils";
import {createOrder} from '../api/orders';
import {OrderSummary} from "../component/orders/OrderSummary";
import {ProductStockInfo} from "../component/products/ProductStockInfo";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({});
    const [addingProduct, setAddingProduct] = useState(false);
    const [quantityInfo, setQuantityInfo] = useState(null);
    const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS_INITIAL_VALUES);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    const {userRole} = useContext(AuthContext);

    const fetchProducts = async () => {
        const validFilters = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== "" && value !== null && value !== undefined)
        );

        try {
            const fetchedProducts = await searchProducts(validFilters);
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const [categories, brands, genders, sizes, colors] = await Promise.all([
                getCategories(),
                getBrands(),
                getGenders(),
                getSizes(),
                getColors(),
            ]);
            setFilterOptions({
                categories,
                brands,
                genders,
                sizes,
                colors,
            });
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleAddProductToggle = () => {
        setAddingProduct(!addingProduct);
    };

    const handleRefreshProducts = () => {
        fetchProducts();
        setAddingProduct(false);
    };

    const addToOrder = (product) => {
        setSelectedOrderItems((prevItems) => {
            const existingProductIndex = prevItems.findIndex((item) => item.id === product.id);
            if (existingProductIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingProductIndex].quantity += product.quantity;
                return updatedItems;
            } else {
                return [...prevItems, {...product}];
            }
        });
    };

    const removeFromOrder = (productId) => {
        setSelectedOrderItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const placeOrder = async () => {
        try {
            const orderData = {
                order_details: selectedOrderItems.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                })),
            };
            await createOrder(orderData);
            console.log('Order placed successfully!');
            setSelectedOrderItems([]);
            fetchProducts();
        } catch (error) {
            console.error('Error placing order:', error);
            console.log('Failed to place order');
        }
    };

    const handleShowQuantity = async (productId) => {
        try {
            const quantityData = await getProductQuantity(productId);
            setQuantityInfo(quantityData);
        } catch (error) {
            console.error('Error fetching product quantity:', error);
        }
    };

    return (
        <div className="px-4 pb-4">
            <div className="mb-6 mt-6">
                <ProductFilter
                    onFilter={handleFilterChange}
                    filterOptions={filterOptions}
                    removeFromOrder={removeFromOrder}
                />
            </div>

            {isSimpleUser(userRole) &&
                <OrderSummary placeOrder={placeOrder} selectedOrderItems={selectedOrderItems}
                              removeFromOrder={removeFromOrder}/>}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-blue-950 text-xl font-bold">Products</h2>
                {IS_NOT_SIMPLE_USER.includes(userRole) && (
                    <button
                        onClick={handleAddProductToggle}
                        className="bg-lime-500 border border-lime-600 text-white px-4 rounded-sm shadow-sm drop-shadow-sm"
                    >
                        {addingProduct ? 'Cancel Adding Product' : 'Add Product'}
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-8">
                {addingProduct && (
                    <ProductCard
                        isNew={true}
                        onRefreshProducts={handleRefreshProducts}
                        filterOptions={filterOptions}
                        setAddingProduct={setAddingProduct}
                    />
                )}
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col gap-2">
                        {IS_NOT_SIMPLE_USER.includes(userRole) &&
                            <ProductStockInfo handleShowQuantity={handleShowQuantity} quantityInfo={quantityInfo}
                                              product={product}/>}
                        <ProductCard
                            product={product}
                            onRefreshProducts={handleRefreshProducts}
                            filterOptions={filterOptions}
                            addToOrder={addToOrder}
                            setAddingProduct={setAddingProduct}
                            addingProduct={addingProduct}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
