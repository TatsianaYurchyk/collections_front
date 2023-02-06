import { Container} from "react-bootstrap";
import AdminPageLoggedInView from "../components/AdminPageLoggedInView";
import AdminPageLoggedOutView from "../components/AdminPageLoggedOutView";
import { User } from "../models/user";

interface AdminPageProps {
    loggedInUser: User | null,
    onLogoutSuccessful: () => void,
}

const AdminPage = ({ loggedInUser,onLogoutSuccessful }: AdminPageProps) => {
    return (
        <Container >
            <>
                {loggedInUser
                    ? <AdminPageLoggedInView loggedInUser={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/>
                    : <AdminPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default AdminPage;