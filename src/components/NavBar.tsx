import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import { useState } from "react";
import Brightness3Icon from '@mui/icons-material/Brightness3';
import WbSunnyIcon from '@mui/icons-material/WbSunny';


interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
    onToggleThemeClicked: ()=> void,
}

const NavBar = ({ loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful, onToggleThemeClicked }: NavBarProps) => {
    const [dark, setDark] = useState(false);
    return (
        <Navbar className="navBar" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand className="navbarBrand" as={Link} to="/home">
                    Your best collection
                </Navbar.Brand>
                <div className="toggleButton"
    
      onChange={() => {
        setDark(!dark);
      }}
      onClick={()=>{setDark(!dark);onToggleThemeClicked()}}
    >
        {dark? <Brightness3Icon />:<WbSunnyIcon />}

    </div>
                <Navbar.Toggle aria-controls="main-navbar" className="blockCenter" />
                <Navbar.Collapse id="main-navbar">
                
                
                    <Nav className="ms-auto">
                        {loggedInUser
                            ? <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
                            : <NavBarLoggedOutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked} />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;