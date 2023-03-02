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
import ItemsOfCollection from "./components/ItemsOfCollection";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme, GlobalStyles } from "./components/Theme";

function App() {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [theme, setTheme] = useState("light");

	const toggleTheme = () => {
		theme === "light" ? setTheme("dark") : setTheme("light");
	};

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

	return (
		<ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
			<GlobalStyles />
			<BrowserRouter>
				<div>
					<NavBar
						loggedInUser={loggedInUser}
						onLoginClicked={() => setShowLoginModal(true)}
						onSignUpClicked={() => setShowSignUpModal(true)}
						onLogoutSuccessful={() => setLoggedInUser(null)}
						onToggleThemeClicked={toggleTheme}
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
							<Route
								path="/collections/:id"
								element={
									<ItemsOfCollection
									loggedInUser={loggedInUser}
									/>
								}
							/>
							<Route
								path="/home"
								element={
									<UsersPage
										loggedInUser={null}
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
		</ThemeProvider>
	);
}

export default App;
