import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as UsersApi from "../network/users_api";
import { useNavigate } from "react-router-dom"
import { useState } from "react";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    const navigate = useNavigate();
    const [adminPanel,setAdminPanel]=useState(false)

    async function logout() {
        try {
            await UsersApi.logout();
            onLogoutSuccessful();
            localStorage.removeItem("loggedInUser")
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
        {user.role==="admin"
            ?<>
            <Navbar.Text className="me-2">
                You are an admin. Signed in as: {user.username}
            </Navbar.Text>
            {!adminPanel?
            <Button onClick={() => {navigate("/adminPanel"); setAdminPanel(true)}} className="buttonColor">Admin Panel</Button>:  <Button onClick={() => {navigate("/"); setAdminPanel(false)} } className="buttonColor">Back to Home Page</Button>}
           
            <Button onClick={()=>{logout();navigate("/") }} className="buttonColor mar-l">Log Out</Button>
            </>
            :<>
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button className="buttonColor" onClick={logout}>Log Out</Button>
            </>}
        </>
    );
}

export default NavBarLoggedInView;