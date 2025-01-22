import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AuthProvider from "./context/AuthContext";
import RedirectRoute from "./component/navigation/RedirectRoute";
import ProtectedRoute from "./component/navigation/ProtectedRoute";
import Layout from "./component/Layout";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Orders from "./pages/Orders";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route
                            path="/register"
                            element={
                                <RedirectRoute>
                                    <Register/>
                                </RedirectRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <RedirectRoute>
                                    <Login/>
                                </RedirectRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute>
                                    <Products/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <Orders/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute>
                                    <Reports/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/clients"
                            element={
                                <ProtectedRoute>
                                    <Clients/>
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </Layout>

            </AuthProvider>
        </Router>
    );
};

export default App;
