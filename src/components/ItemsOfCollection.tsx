import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { UserNote } from "../models/userNote";
import { Collection } from "../models/collection";
import {Item} from "../models/item";
import * as UsersApi from "../network/users_api";
import * as CollectionsApi from "../network/collections_api";
import * as ItemsApi from "../network/items_api";
import Table from "react-bootstrap/Table";
import { formatDate } from "../utils/formatDate";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaLockOpen } from "react-icons/fa";
import { User } from "../models/user";
//import { DataGrid, GridActionsCellItem, GridColDef, GridColTypeDef ,GridColumns,GridRowId,GridValueGetterParams, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { DataGrid, GridColTypeDef, GridRowId } from "@mui/x-data-grid";
import SecurityIcon from "@mui/icons-material/Security";
import { useParams } from "react-router-dom";
import {
	DataGridPro,
	GridColumns,
	GridRowsProp,
	GridActionsCellItem,
	GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import Field from "./Field";
import ItemModal from "./ItemModal";


interface AdminPageProps {
	loggedInUser: User;
	onLogoutSuccessful: () => void;
	collectionToSee: Collection;
}
type Params = {
	id: string;
  };

// type Row = typeof initialRows[number];

const ItemsOfCollection = ()=>
// ({
// 	collectionToSee,
// 	loggedInUser,
// 	onLogoutSuccessful,
// }: AdminPageProps) => {
	{
		const {id}=useParams<Params>();
	const [collection, setCollection] = useState<Collection>();
	const [fields, setFields] = useState<string[]>(["_id","name"]);
	const [items, setItems] = useState<Item[]>([]);
	const [isCheck, setIsCheck] = useState<Item[]>([]);
	const [pageSize, setPageSize] = useState<number>(10);
	const [showItemModal, setShowItemModal] =useState(false);


	useEffect(() => {
		async function loadCollection() {
			try {
				if (id) {
				// const collection = await CollectionsApi.getCollection(collectionToSee._id);
				const collection = await CollectionsApi.getCollection(id)
				setCollection(collection)
				const newFields=fields.concat(collection.fields);
				console.log(newFields);
				setFields(newFields);
			}
			} catch (error) {
				console.error(error);
			}
		}
		loadCollection();
	}, []);

	useEffect(() => {
		async function loadItems() {
			try {
				if (id) {
				// const collection = await CollectionsApi.getCollection(collectionToSee._id);
				//const items = await ItemsApi.fetchItems(id)
				const newItems= (await ItemsApi.fetchItems(id)).map(item=>Object.assign(item.properties,item))
				setItems(newItems);
				// setItems(items)
				console.log(items)}
			} catch (error) {
				console.error(error);
			}
		}
		loadItems();
	}, [showItemModal]);

	async function deleteItem(item: Item) {
		try {
			await ItemsApi.deleteItem(item._id);
			setItems(
				items.filter((existingItem) => existingItem._id !== item._id)
			);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	async function loadItems() {
		try {
			if (id) {
			// const collection = await CollectionsApi.getCollection(collectionToSee._id);
			//const items = await ItemsApi.fetchItems(id)
			const newItems= (await ItemsApi.fetchItems(id)).map(item=>Object.assign(item.properties,item))
			setItems(newItems);
			// setItems(items)
			console.log(items)}
		} catch (error) {
			console.error(error);
		}
	}

	const onRowsSelectionHandler = (ids: any) => {
		const selectedRowsData = ids.map((id: any) =>
			items.find((item) => item._id === id)
		);
		console.log(selectedRowsData);
		setIsCheck(selectedRowsData);
	};
	// async function loadItems() {
	// 	try {
	// 		const items = await UsersApi.fetchUsers();
	// 		setUsers(users);
	// 		console.log("loadusers");
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// }

	const columns:GridColumns=[];
	fields.map(item=> columns.push({ field: item, headerName: item, width: 150 }));

	const deleteAll = () => {
		console.log(isCheck)
		isCheck.map((item) =>
			deleteItem(item)
				// .then(() => {
				// 	isCheck.find((item) =>
				// 		item.username === loggedInUser.username
				// 			? logout()
				// 			: setIsCheck([])
				// 	);
				// })
				.then((res) => {
					loadItems();
				})
		);
	};


	return (
		<>
		{collection
			? <><h1> Hello {collection.name}</h1>
			<div className="page_container">
					<div className="d-flex justify-content-center">
						{" "}
						<h1 className="center">{collection.name}</h1>
					</div>
					<ButtonGroup
						aria-label="Basic example"
						className="mb-3 width100 adminBtn">
						<Button variant="primary" onClick={() => setShowItemModal(true)}>
							Add new Item
						</Button>
						{/* <Button variant="secondary" onClick={activateStatusAll}>
							<FaLockOpen />
						</Button> */}
						<Button variant="secondary" onClick={deleteAll}>
							<FaTrashAlt />
						</Button>
					</ButtonGroup>
					<div style={{ height: 600, width: "100%" }}>
						{/* <div style={{ display: 'flex', height: '100%' }}> */}
						<DataGrid
							rows={items}
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
				{showItemModal && (
				<ItemModal
					collection={collection}
					fields={fields}
					onDismiss={() => setShowItemModal(false)}
					onItemSaved={(newItem) => {
						setItems([...items, newItem]);
						setShowItemModal(false);
					}}
				/>
			)}
					
				
					</>
			: <p>You don't have any items yet</p>
		}
	</>
	)

	
};

export default ItemsOfCollection;
