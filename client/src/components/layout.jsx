import Navbar from "./containers/navbar";
import {Outlet} from "react-router-dom";

const Layout = ()=> {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main> 
        
        
        </>
    );
};

export default Layout;