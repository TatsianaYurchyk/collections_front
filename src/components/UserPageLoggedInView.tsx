import { User } from "../models/user";
import { Topic as TopicModel } from "../models/topic";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as CollectionsApi from "../network/collections_api";
import CreateCollectionModal from "./CreateCollectionModal";

interface UserPageProps {
	loggedInUser: User;
	onLogoutSuccessful: () => void;
}

const UserPageLoggedInView = ({
	loggedInUser,
	onLogoutSuccessful,
}: UserPageProps) => {


	const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);



    return (
		<div className="page_container">
		<div className="d-flex justify-content-center">
			{/* {" "} */}
			<h1 className="center"> {loggedInUser.username}'s Personal Page</h1>
		</div>
            <p className="text-center">UserPageLoggedInView</p> 
			<Button onClick={() =>setShowCreateCollectionModal(true)}> Create a new Collection</Button>
			{showCreateCollectionModal && (
					<CreateCollectionModal
						onDismiss={() => setShowCreateCollectionModal(false)}
						// onLoginSuccessful={(user) => {
						// 	setLoggedInUser(user);
						// 	setShowLoginModal(false);
						// }}
					/>
				)}
			</div>
    );
}

export default UserPageLoggedInView;