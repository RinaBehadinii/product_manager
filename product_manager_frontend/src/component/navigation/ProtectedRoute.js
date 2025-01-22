import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const ProtectedRoute = ({children}) => {
    const {authTokens} = useContext(AuthContext);

    return authTokens ? children : <Navigate to="/login"/>;
};

export default ProtectedRoute;
