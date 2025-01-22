import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

const RedirectRoute = ({children}) => {
    const {authTokens} = useContext(AuthContext);

    return authTokens ? <Navigate to="/dashboard"/> : children;
};

export default RedirectRoute;
