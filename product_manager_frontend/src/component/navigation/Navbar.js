import React, {useContext} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const Navbar = () => {
    const {userRole, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "font-bold underline" : "";

    return (
        <nav
            className="w-full bg-blue-900 border-b border-blue-950 rounded-b-sm drop-shadow-sm shadow-sm text-white py-3">
            <div className="container mx-auto flex justify-between items-center min-w-full px-4">
                <h1 className="text-2xl font-bold">
                    <Link to="/">Products MS</Link>
                </h1>
                <div className="space-x-4">
                    {/*<Link to="/" className={`hover:underline ${isActive("/")}`}>Dashboard</Link>*/}
                    <Link to="/products" className={`hover:underline ${isActive("/products")}`}>
                        Products
                    </Link>
                    <Link to="/orders" className={`hover:underline ${isActive("/orders")}`}>
                        Orders
                    </Link>
                    {(userRole === "Admin" || userRole === "Advanced User") && (
                        <Link to="/reports" className={`hover:underline ${isActive("/reports")}`}>
                            Reports
                        </Link>
                    )}
                    {userRole === "Admin" && (
                        <Link to="/clients" className={`hover:underline ${isActive("/clients")}`}>
                            Clients
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
