import React, {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {refreshToken as refreshAccessToken} from "../api/auth";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
    );
    const [userRole, setUserRole] = useState(() =>
        localStorage.getItem("role") ? localStorage.getItem("role") : null
    );
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (authTokens && !loading) {
            const interval = setInterval(() => {
                refreshAccessToken(authTokens.refresh)
                    .then((data) => {
                        setAuthTokens((prevTokens) => ({
                            ...prevTokens,
                            access: data.access,
                        }));
                        localStorage.setItem("authTokens", JSON.stringify({...authTokens, access: data.access}));
                    })
                    .catch(() => logout());
            }, 14 * 60 * 1000);
            return () => clearInterval(interval);
        }
        setLoading(false);
    }, [authTokens]);

    const login = (accessToken, role) => {
        setAuthTokens({access: accessToken});
        setUserRole(role);
        localStorage.setItem("authTokens", JSON.stringify({access: accessToken}));
        localStorage.setItem("role", role);
        navigate("/products");
    };

    const logout = () => {
        setAuthTokens(null);
        setUserRole(null);
        localStorage.removeItem("authTokens");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{authTokens, userRole, login, logout, loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
