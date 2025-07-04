import Navbar from "./containers/navbar";
import Routines from "./pages/routines/routines";
import {Outlet} from "react-router-dom";

const Layout = ({loggedIn, setLoggedIn})=> {
    return (
        <>
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
            <main>
                <Outlet />
                
            </main> 
        
        
        </>
    );
};

export default Layout;