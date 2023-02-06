import { Container} from "react-bootstrap";
import UserPageLoggedInView from "../components/UserPageLoggedInView";
import UserPageLoggedOutView from "../components/UserPageLoggedOutView";
import { User } from "../models/user";

interface UserPageProps {
    loggedInUser: User | null,
    onLogoutSuccessful: () => void,
}

const UsersPage = ({ loggedInUser,onLogoutSuccessful }: UserPageProps) => {
    return (
        <Container >
            <>
                {loggedInUser
                    ? <UserPageLoggedInView loggedInUser={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/>
                    : <UserPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default UsersPage;