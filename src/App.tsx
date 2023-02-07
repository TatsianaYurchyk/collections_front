import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as UsersApi from "./network/users_api";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";

function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await UsersApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.error(error);
			}
		}
		fetchLoggedInUser();
	}, []);

	// useEffect(() => {
	// 	loggedInUser? localStorage.setItem("loggedInUser", loggedInUser.username):localStorage.removeItem("loggedInUser");
	// }, [loggedInUser]);

	//loggedInUser? sessionStorage.setItem("loggedInUser", loggedInUser.username):sessionStorage.removeItem("loggedInUser");

	return (
		<BrowserRouter>
			<div>
				<NavBar
					loggedInUser={loggedInUser}
					onLoginClicked={() => setShowLoginModal(true)}
					onSignUpClicked={() => setShowSignUpModal(true)}
					onLogoutSuccessful={() => setLoggedInUser(null)}
				/>
				<Container className="page_padd">
					<Routes>
						<Route
							path="/"
							element={
								<UsersPage
									loggedInUser={loggedInUser}
									onLogoutSuccessful={() =>
										setLoggedInUser(null)
									}
								/>
							}
						/>
						<Route
							path="/adminPanel"
							element={
								<AdminPage
									loggedInUser={loggedInUser}
									onLogoutSuccessful={() =>
										setLoggedInUser(null)
									}
								/>
							}
						/>
					</Routes>
				</Container>
				{showSignUpModal && (
					<SignUpModal
						onDismiss={() => setShowSignUpModal(false)}
						onSignUpSuccessful={(user) => {
							setLoggedInUser(user);
							setShowSignUpModal(false);
						}}
					/>
				)}
				{showLoginModal && (
					<LoginModal
						onDismiss={() => setShowLoginModal(false)}
						onLoginSuccessful={(user) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				)}
			</div>
		</BrowserRouter>
	);
}

export default App;
