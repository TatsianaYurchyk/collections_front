import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
    return (
        <>
            <Button onClick={onSignUpClicked} className="buttonColor" >Sign Up</Button>
            <Button onClick={onLoginClicked} className="buttonColor" >Log In</Button>
        </>
    );
}

export default NavBarLoggedOutView;