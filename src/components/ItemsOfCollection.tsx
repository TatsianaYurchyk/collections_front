import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { Collection } from "../models/collection";
import { Item } from "../models/item";
import * as CollectionsApi from "../network/collections_api";
import * as ItemsApi from "../network/items_api";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { User } from "../models/user";
//import { DataGrid, GridActionsCellItem, GridColDef, GridColTypeDef ,GridColumns,GridRowId,GridValueGetterParams, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
import { DataGrid } from "@mui/x-data-grid";
import SecurityIcon from "@mui/icons-material/Security";
import { useParams } from "react-router-dom";
import { GridColumns, GridActionsCellItem } from "@mui/x-data-grid-pro";
import ItemModal from "./ItemModal";

type Params = {
	id: string;
};
interface ItemsOfCollectionProps {
	loggedInUser: User|null;
}

const ItemsOfCollection = ({
	loggedInUser,
}: ItemsOfCollectionProps) =>
	{
		const { id } = useParams<Params>();
		const [collection, setCollection] = useState<Collection>();
		const [fields, setFields] = useState<string[]>(["_id", "name"]);
		const [items, setItems] = useState<Item[]>([]);
		const [isCheck, setIsCheck] = useState<Item[]>([]);
		const [pageSize, setPageSize] = useState<number>(10);
		const [showItemModal, setShowItemModal] = useState(false);
		const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

		useEffect(() => {
			async function loadCollection() {
				try {
					if (id) {
						// const collection = await CollectionsApi.getCollection(collectionToSee._id);
						const collection = await CollectionsApi.getCollection(
							id
						);
						setCollection(collection);
						const newFields = fields.concat(collection.fields);
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
						const newItems = (await ItemsApi.fetchItems(id)).map(
							(item) => Object.assign(item.properties, item)
						);
						setItems(newItems);
						console.log(items);
					}
				} catch (error) {
					console.error(error);
				}
			}
			loadItems();
		}, [showItemModal, itemToEdit]);

		async function deleteItem(item: Item) {
			try {
				await ItemsApi.deleteItem(item._id);
				setItems(
					items.filter(
						(existingItem) => existingItem._id !== item._id
					)
				);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		}

		async function loadItems() {
			try {
				if (id) {
					const newItems = (await ItemsApi.fetchItems(id)).map(
						(item) => Object.assign(item.properties, item)
					);
					setItems(newItems);
					console.log(items);
				}
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
		
		let columns: GridColumns = [];
 if (loggedInUser && collection && (loggedInUser._id==collection.userId || loggedInUser.role=="admin")){
	loggedInUser._id==collection.userId? columns=[{
		field: "actions",
		type: "actions",
		headerName: "Update",
		width: 100,
		getActions: (params) => [
			<GridActionsCellItem
				icon={<SecurityIcon />}
				label="Update item"
				onClick={() => changeItem(params.id)}
				showInMenu
			/>,
		],
	},] : columns=[];
 }
		
		fields.map((item) =>
			columns.push({ field: item, headerName: item, width: 200 })
		);

		const deleteAll = () => {
			console.log(isCheck);
			isCheck.map((item) =>
				deleteItem(item).then((res) => {
					loadItems();
				})
			);
		};

		const changeItem = (id: any) => {
			const forUpdateItem = items.find((item) => item._id === id);
			forUpdateItem ? setItemToEdit(forUpdateItem) : setItemToEdit(null);
			loadItems();
		};

		return (
			<>
				{collection ? (
					<>
						<div className="page_container">
							<div className="d-flex justify-content-center">
								{" "}
								<h1 className="center">{collection.name}</h1>
							</div>
							{ (loggedInUser && collection && (loggedInUser._id==collection.userId || loggedInUser.role=="admin"))?
	
							 <ButtonGroup
								aria-label="Basic example"
								className="mb-3 width100 adminBtn">
								<Button
									className="buttonColor"
									onClick={() => setShowItemModal(true)}>
									Add new Item
								</Button>
								<Button variant="secondary" onClick={deleteAll}>
									<FaTrashAlt />
								</Button>
							</ButtonGroup>:""}
							
							<div style={{ height: 600, width: "100%" }}>
								
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

						{itemToEdit && (
							<ItemModal
								collection={collection}
								itemToEdit={itemToEdit}
								fields={fields}
								onDismiss={() => setItemToEdit(null)}
								onItemSaved={(updatedItem) => {
									setItems(
										items.map((existingItem) =>
											existingItem._id === updatedItem._id
												? updatedItem
												: existingItem
										)
									);
									setItemToEdit(null);
								}}
							/>
						)}
					</>
				) : (
					<p>You don't have any items yet</p>
				)}
			</>
		);
	};

export default ItemsOfCollection;
