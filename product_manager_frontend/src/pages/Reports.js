import React, {useState, useEffect} from 'react';
import {fetchDailyEarnings, fetchTopSellingProducts} from '../api/reports';
import ReportCard from "../component/ReportCard";

const Reports = () => {
    const [dailyEarnings, setDailyEarnings] = useState(null);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const earnings = await fetchDailyEarnings();
                setDailyEarnings(earnings);

                const topSelling = await fetchTopSellingProducts();
                setTopProducts(topSelling);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        loadReports();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-blue-950 text-3xl font-bold mb-6">Reports</h1>

            {dailyEarnings && (
                <ReportCard
                    report={{
                        title: 'Daily Earnings',
                        description: `Total earnings for ${dailyEarnings.date}`,
                        data: [{label: 'Total Earnings', value: `$${dailyEarnings.total_earnings}`}],
                    }}
                />
            )}

            <div className="mt-8">
                <h2 className="text-blue-950 text-2xl font-bold text-gray-900 mb-4">Top-Selling Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {topProducts.map((product, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">{product.product__name}</h3>
                            <p className="text-gray-600 mt-2">
                                <span className="font-medium text-gray-800">Total Sold:</span> {product.total_sold}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
