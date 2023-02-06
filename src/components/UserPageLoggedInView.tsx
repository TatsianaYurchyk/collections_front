import { User } from "../models/user";

interface UserPageProps {
	loggedInUser: User;
	onLogoutSuccessful: () => void;
}

const UserPageLoggedInView = ({
	loggedInUser,
	onLogoutSuccessful,
}: UserPageProps) => {
    return (
            <p className="text-center">UserPageLoggedInView</p> 
    );
}

export default UserPageLoggedInView;