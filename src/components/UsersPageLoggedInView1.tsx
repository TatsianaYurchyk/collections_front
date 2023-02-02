import { useEffect, useState } from "react";
import { Button} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { UserNote } from "../models/userNote";
import * as UsersApi from "../network/users_api";
import Table from "react-bootstrap/Table";
import { formatDate } from "../utils/formatDate";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaLockOpen } from "react-icons/fa";
import { User } from "../models/user";
//import { DataGrid, GridActionsCellItem, GridColDef, GridColTypeDef ,GridColumns,GridRowId,GridValueGetterParams, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { DataGrid, GridColTypeDef} from '@mui/x-data-grid';

import {
	DataGridPro,
	GridColumns,
	GridRowsProp,
	GridActionsCellItem,
	GRID_CHECKBOX_SELECTION_COL_DEF,
  } from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';

interface UsersPageProps {
	loggedInUser: User,
	onLogoutSuccessful: () => void,
}


// type Row = typeof initialRows[number];


const UsersPageLoggedInView = ({ loggedInUser,onLogoutSuccessful }: UsersPageProps) => {
	const [users, setUsers] = useState<UserNote[]>([]);
	const [isCheck, setIsCheck] = useState<UserNote[]>([]);
	// const [isCheckAll, setIsCheckAll] = useState(false);
	// const [isClick, setIsClick] = useState(false);

	const [pageSize, setPageSize] = useState<number>(5);


// 	const [rows, setRows] = useState<Row[]>(users);

//   const deleteUser = useCallback(
//     (id: GridRowId) => () => {
//       setTimeout(() => {
//         setRows((prevRows) => prevRows.filter((row) => row.id !== id));
//       });
//     },
//     [],
//   );

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
		type: 'number',
		width: 150,
		valueFormatter: ({ value }) => formatDate(value),
		cellClassName: 'font-tabular-nums',
	  };
	
	// const columns: GridColDef[] = [
	const columns: GridColumns = [
		{ field: '_id', headerName: 'ID',width: 250, },
		{ field: 'username', headerName: 'Username', width: 150, },
		{ field: 'email', headerName: 'Email',width: 150 },
		{ field: 'createdAt',headerName: 'SignUp Time', ...signUpTime},
		{ field: 'role', headerName: 'Role',width: 100  },
		{ field: 'status', headerName: 'Status', width: 100 },
		{
			field: 'actions',
			type: 'actions',
			width: 100,
			getActions: (params) => [
				<GridActionsCellItem
				icon={<DeleteIcon />}
				label="Delete"
			
			  />,
			],
		  },
	];






	// Checkbox handle start

	const handleAllChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUsers = users;
		newUsers.forEach(user => (user.isChecked = e.target.checked));
		setUsers(newUsers);
		e.target.checked? setIsCheck(newUsers):setIsCheck([])
	  };
	
	const toggleCheckbox = (e: React.ChangeEvent<HTMLInputElement>,item: any) => {
		// const newUsers = users;
		// newUsers.forEach(user => {
		//   if (user.username === e.target.name){user.isChecked = e.target.checked}
			
		// });
		// setUsers(newUsers)
		let tempUser = isCheck.find((user) => user.username === e.target.name);
		if (tempUser) {
			isCheck.splice(isCheck.indexOf(item), 1);
		} else {
			let newCheckedUsers = isCheck;
			newCheckedUsers.push(item);
			setIsCheck(newCheckedUsers);
		}
		console.log(isCheck);

	  };

	// const handleAllChecked = () => {
	// 	setIsCheckAll((prev) => !prev);
	// };
	// const handleAllCheckedFull = () => {
	// 	if (isCheckAll) {
	// 		users.forEach((user) => (user.isChecked = true));
	// 		setIsCheck(users);

	// 	} else {
	// 		setIsCheck([]);
	// 		users.forEach((user) => (user.isChecked = false));
	// 	}
	// 	console.log(isCheckAll)
	// 	console.log(isCheck)
	// };

	// useEffect(() => {
	// 	handleAllCheckedFull();
	// }, 	[isCheckAll]);

	// Checkbox handle end

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

	// const deleteAll = () => {
	// 	isCheck.map((item) => deleteUser(item));
	// 	isCheck.find((item) =>
	// 		item.username === loggedInUser.username
	// 			? logout()
	// 			: setIsCheck([]))
    //     loadUsers()
	// };
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
	// const blockStatusAll = () => {
	// 	isCheck.map((item) => blockStatus(item));
	// 	setIsClick((prev) => !prev);
	// 	loadUsers();
	// 	console.log(isCheck);
	// };
	
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
	const dropUser =()=>{
		isCheck.find((item) =>
			item.username === loggedInUser.username
				? logout()
				: console.log("you're still active")
		);
	}

	// useEffect(() => {
	// 	dropUser()
	// }, [isClick]);

	async function activateStatus(user: UserNote) {
		try {
			await UsersApi.activateStatus(user._id);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}
	// const activateStatusAll = () => {
	// 	isCheck.map((item) => activateStatus(item));
	// 	loadUsers()
	// 	// setIsCheck([])
	// };
	const activateStatusAll = () => {
			isCheck.map((item) =>
				activateStatus(item).then((res) => {
					loadUsers();
				})
			);
	};


    // const usersGrid = (
	// 	<>
	// 		{users.map((user) => (
				// <tr key={user._id}>
				// 	<td>
				// 		<input
				// 			type="checkbox"
				// 			name={user.username}
				// 			id={user._id}
				// 			checked={user.isChecked}
				// 			onChange={(e) => toggleCheckbox(e, user)}
				// 		/>
				// 	</td>
				// 	<td>{user._id}</td>
				// 	<td>{user.username}</td>
				// 	<td>{user.email}</td>
				// 	<td>{formatDate(user.createdAt)}</td>
				// 	<td>{user.status}</td>
				// </tr>
				
	// 		))}
	// 	</>
	// );
	const onRowsSelectionHandler = (ids:any) => {
		const selectedRowsData = ids.map((id:any) => users.find((user) => user._id === id));
		console.log(selectedRowsData);
		setIsCheck(selectedRowsData)
	  };

	return (
		<>
			{users.length > 0 ? (
				<>
					<ButtonGroup aria-label="Basic example" className="mb-3 width100">
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
					<div style={{ height: 600, width: '100%' }}>
					{/* <div style={{ display: 'flex', height: '100%' }}> */}
					<DataGrid
				rows={users}
				columns={columns}
				// pageSize={10}
				// rowsPerPageOptions={[10]}
				checkboxSelection
				disableSelectionOnClick
  onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
				getRowId={(row) => row._id}
				// initialState={{
				// 	pinnedColumns: {
				// 	  left: [GRID_CHECKBOX_SELECTION_COL_DEF.field],
				// 	  right: ['actions'],
				// 	},
				//   }}
				  pageSize={pageSize}
				  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
				  rowsPerPageOptions={[5, 10, 20]}
				  sx={{
					".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
					  "margin-top": "1em",
					  "margin-bottom": "1em"
					}
				  }}			  
			  />
     
    </div>
	
				</>
			) : (
				<p>Wait,there is nothing to see... </p>
			)}
		</>
	);
};

export default UsersPageLoggedInView;
