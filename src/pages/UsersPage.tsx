import { Container} from "react-bootstrap";
import UsersPageLoggedInView1 from "../components/UsersPageLoggedInView1";
import UsersPageLoggedOutView from "../components/UsersPageLoggedOutView";
import { User } from "../models/user";

interface UsersPageProps {
    loggedInUser: User | null,
    onLogoutSuccessful: () => void,
}

const UsersPage = ({ loggedInUser,onLogoutSuccessful }: UsersPageProps) => {
    return (
        <Container >
            <>
                {loggedInUser
                    ? <UsersPageLoggedInView1 loggedInUser={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/>
                    : <UsersPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default UsersPage;