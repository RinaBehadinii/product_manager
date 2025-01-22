import {useLocation} from 'react-router-dom';
import Navbar from "./navigation/Navbar";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";

function Layout({children}) {
    const location = useLocation();
    const {authTokens} = useContext(AuthContext);

    return (
        <div className="min-w-[98vw] min-h-[100vh] bg-gray-50">
            {authTokens && <Navbar/>}
            <div className="flex flex-col">{children}</div>
        </div>
    );
};

export default Layout;