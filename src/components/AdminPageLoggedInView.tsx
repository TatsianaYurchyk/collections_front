import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { UserNote } from "../models/userNote";
import * as UsersApi from "../network/users_api";
import Table from "react-bootstrap/Table";
import { formatDate } from "../utils/formatDate";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaLockOpen } from "react-icons/fa";
import { User } from "../models/user";
//import { DataGrid, GridActionsCellItem, GridColDef, GridColTypeDef ,GridColumns,GridRowId,GridValueGetterParams, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { DataGrid, GridColTypeDef, GridRowId } from "@mui/x-data-grid";
import SecurityIcon from "@mui/icons-material/Security";

import {
	DataGridPro,
	GridColumns,
	GridRowsProp,
	GridActionsCellItem,
	GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Delete";

interface AdminPageProps {
	loggedInUser: User;
	onLogoutSuccessful: () => void;
}

// type Row = typeof initialRows[number];

const AdminPageLoggedInView = ({
	loggedInUser,
	onLogoutSuccessful,
}: AdminPageProps) => {
	const [users, setUsers] = useState<UserNote[]>([]);
	const [isCheck, setIsCheck] = useState<UserNote[]>([]);
	const [pageSize, setPageSize] = useState<number>(10);

	useEffect(() => {
		async function loadUsers() {
			try {
				const users = await UsersApi.fetchUsers();
				setUsers(users);
			} catch (error) {
				console.error(error);
			}
		}
		loadUsers();
	}, [isCheck]);

	const signUpTime: GridColTypeDef = {
		type: "number",
		width: 200,
		valueFormatter: ({ value }) => formatDate(value),
		cellClassName: "font-tabular-nums",
	};

	// const columns: GridColDef[] = [
	const columns: GridColumns = [
		{ field: "_id", headerName: "ID", width: 250 },
		{ field: "username", headerName: "Username", width: 150 },
		{ field: "email", headerName: "Email", width: 150 },
		{ field: "createdAt", headerName: "SignUp Time", ...signUpTime },
		{ field: "role", headerName: "Role", width: 100 },
		{ field: "status", headerName: "Status", width: 100 },
		{
			field: "actions",
			type: "actions",
			headerName: "Set Role",
			width: 100,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<SecurityIcon />}
					label="Toggle User"
					onClick={() => toggleUser(params.id)}
					showInMenu
				/>,

				<GridActionsCellItem
					icon={<SecurityIcon />}
					label="Toggle Admin"
					onClick={() => toggleAdmin(params.id)}
					showInMenu
				/>,
			],
		},
	];

	async function deleteUser(user: UserNote) {
		try {
			await UsersApi.deleteUser(user._id);
			setUsers(
				users.filter((existingUser) => existingUser._id !== user._id)
			);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}
	async function loadUsers() {
		try {
			const users = await UsersApi.fetchUsers();
			setUsers(users);
			console.log("loadusers");
		} catch (error) {
			console.error(error);
		}
	}
	async function logout() {
		try {
			await UsersApi.logout();
			onLogoutSuccessful();
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	const deleteAll = () => {
		isCheck.map((item) =>
			deleteUser(item)
				.then(() => {
					isCheck.find((item) =>
						item.username === loggedInUser.username
							? logout()
							: setIsCheck([])
					);
				})
				.then((res) => {
					loadUsers();
				})
		);
	};

	async function blockStatus(user: UserNote) {
		try {
			await UsersApi.blockStatus(user._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	const blockStatusAll = () => {
		isCheck.map((item) =>
			blockStatus(item)
				.then((res) => {
					isCheck.find((item) =>
						item.username === loggedInUser.username
							? logout()
							: console.log("you're still active")
					);
				})
				.then((res) => {
					loadUsers();
				})
		);
	};

	async function activateStatus(user: UserNote) {
		try {
			await UsersApi.activateStatus(user._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	const activateStatusAll = () => {
		isCheck.map((item) =>
			activateStatus(item).then((res) => {
				loadUsers();
			})
		);
	};

	async function setAdmin(user: UserNote) {
		try {
			await UsersApi.setAdmin(user._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	async function setNotAdmin(user: UserNote) {
		try {
			await UsersApi.setNotAdmin(user._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	// const setNotAdminAll = () => {
	// 	isCheck.map((item) =>
	// 		setNotAdmin(item).then((res) => {
	// 			loadUsers();
	// 		})
	// 	);
	// };

	const onRowsSelectionHandler = (ids: any) => {
		const selectedRowsData = ids.map((id: any) =>
			users.find((user) => user._id === id)
		);
		console.log(selectedRowsData);
		setIsCheck(selectedRowsData);
	};

	const toggleAdmin = (id: any) => {
		const toggleUserRole = users.find((user) => user._id === id);
		toggleUserRole
			? setAdmin(toggleUserRole).then((res) => {
				loadUsers();
			  })
			: loadUsers();
	};
	const toggleUser = (id: any) => {
		const toggleUserRole = users.find((user) => user._id === id);
		toggleUserRole
			? setNotAdmin(toggleUserRole).then((res) => {
					toggleUserRole.username === loggedInUser.username
					? logout()
					: loadUsers();
			  })
			: loadUsers();
	};

	return (
		<>
			{users.length > 0 ? (
				<div className="page_container">
					<div className="d-flex justify-content-center">
						{" "}
						<h1 className="center">Admin Panel</h1>
					</div>
					<ButtonGroup
						aria-label="Basic example"
						className="mb-3 width100 adminBtn">
						<Button variant="danger" onClick={blockStatusAll}>
							Block
						</Button>
						<Button variant="secondary" onClick={activateStatusAll}>
							<FaLockOpen />
						</Button>
						<Button variant="secondary" onClick={deleteAll}>
							<FaTrashAlt />
						</Button>
					</ButtonGroup>
					<div style={{ height: 600, width: "100%" }}>
						{/* <div style={{ display: 'flex', height: '100%' }}> */}
						<DataGrid
						className="table"
							rows={users}
							columns={columns}
							// pageSize={10}
							// rowsPerPageOptions={[10]}
							checkboxSelection
							disableSelectionOnClick
							onSelectionModelChange={(ids) =>
								onRowsSelectionHandler(ids)
							}
							getRowId={(row) => row._id}
							// initialState={{
							// 	pinnedColumns: {
							// 	  left: [GRID_CHECKBOX_SELECTION_COL_DEF.field],
							// 	  right: ['actions'],
							// 	},
							//   }}
							pageSize={pageSize}
							onPageSizeChange={(newPageSize) =>
								setPageSize(newPageSize)
							}
							rowsPerPageOptions={[5, 10, 20]}
							sx={{
								".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
									{
										"margin-top": "1em",
										"margin-bottom": "1em",
									},
							}}
						/>
					</div>
				</div>
			) : (
				<p>Wait,there is nothing to see... </p>
			)}
		</>
	);
};

export default AdminPageLoggedInView;
