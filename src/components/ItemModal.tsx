import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/users_api";
import * as CollectionsApi from "../network/collections_api";
import * as ItemsApi from "../network/items_api";
import { Alert, Button, Form, ListGroup, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import TextAreaInputField from "./form/TextAreaInputField";

import { createRef, Key, useEffect, useRef, useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";
import { Topic as TopicModel } from "../models/topic";
import { CountertopsOutlined, Topic } from "@mui/icons-material";
import Select from "react-select";
import { Item} from "../models/item";
import { Collection} from "../models/collection";
import { ItemInput } from "../network/items_api";
import { Console } from "console";
import { idText } from "typescript";
import InputGroup from "react-bootstrap/InputGroup";
// import Collection from "./Collection";

// import { ValueType } from "react-select";

interface ItemModalProps {
    collection:Collection,
    fields:string[],
	itemToEdit?: Item,
	onDismiss: () => void;
	onItemSaved: (item: Item) => void;
	// onLoginSuccessful: (user: User) => void,
	children?: JSX.Element|JSX.Element[];
}

const ItemModal = ({
    collection, fields,
	itemToEdit,
	onDismiss,
	onItemSaved,
}: ItemModalProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);
	// const [topics, setTopics] = useState<TopicModel[]>([]);
	// const [selectedOption, setSelectedOption] = useState<TopicModel | null>(
	// 	null
	// );
	// const [formValues, setFormValues] = useState<any[]>([]);
	// const [formValues, setFormValues] = useState<any[]>([]);
	// const [toggle, setToggle] = useState(false);
	// const [countField, setCountField] = useState<number>(1);
	const [formFields, setFormFields] = useState<string[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ItemInput>
	(
		// {defaultValues: {
        //     name: itemToEdit?.name || "",
        //     description: collectionToEdit?.description || "",
        //     name: collectionToEdit?.name || "",
        //     fields: collectionToEdit?.fields || [],
        // }}
    
	);

 

	// useEffect(() => {
	// 	async function loadTopics() {
	// 		try {
	// 			const topics = await CollectionsApi.fetchTopics();
	// 			setTopics(topics);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// 	loadTopics();
	// 	// console.log(topics)
	// }, []);

	useEffect(() => {
		const newFields=fields.filter((field) => field!=='_id');
		setFormFields(newFields)
	}, []);

	// useEffect(() => {
	// 	async function loadCollection() {
	// 		try {
	// 			if (collectionToEdit) {
	// 			const collection = await CollectionsApi.getCollection(collectionToEdit._id);
	// 			setFormValues(collection.fields);
	// 			const newTopic=topics.find((topic)=>topic.value==collection.topic);
	// 				newTopic? setSelectedOption(newTopic):setSelectedOption(null);
	// 				// console.log(selectedOption)
			
	// 		}
	// 			else {setFormValues([])
	// 				setSelectedOption(null)
	// 			}

	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// 	loadCollection();

	// }, [topics]);

	const inputRef = useRef();
	// const inputRef = createRef<HTMLInputElement>();

	

	// const handleChange = (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// 	index: any
	// ) => {
	// 	const values = [...formValues];
	// 	values[index].value = e.target.value;
	// 	setFormValues(values);
	// 	console.log(formValues);
	// 	console.log(e.target.value);
	// 	setToggle(false);
	// };

	// const deleteField = (index: any) => {
	// 	const values = [...formValues];
	// 	values.splice(index, 1);
	// 	setFormValues(values);
	// };
	async function onSubmit(input: ItemInput) {
		try {
			let itemResponse: Item;
			input.collectionId=collection._id;
			let preInput = 
			Object.fromEntries(
				Object.entries(input).filter(([key, value]) => key!=="name" && key!=="collectionId" )
			  );
			input.properties= preInput;
			if (!itemToEdit) {
			
				itemResponse = await ItemsApi.createItem(input);
				onItemSaved(itemResponse);
				console.log(preInput)
			}
		 else {
		
			itemResponse = await ItemsApi.updateItem(itemToEdit._id,input)
		onItemSaved(itemResponse);
	}
		
	}
	
	 catch (error) {
		console.error(error);
		// alert(error);
	}
}
	

	return (
		<Modal show onHide={onDismiss} >
		<Modal.Header closeButton className="modalBody">
			<Modal.Title >
			{itemToEdit?"Update the ":"Create an"}	Item of Collection {collection.name}
			</Modal.Title>
		</Modal.Header>

		<Modal.Body className="modalBody">
			{errorText &&
				<Alert variant="danger">
					{errorText}
				</Alert>
			}
			<Form onSubmit={handleSubmit(onSubmit)}>
				{formFields.map(field=>
					<TextInputField
					key={field}
					name={field}
					label={field}
					type="text"
					placeholder={field}
					register={register}
					registerOptions={{ required: "Required" }}
					// error={errors.{field}}
				/>

				)}
				
				
				<Button
					type="submit"
					disabled={isSubmitting}
					className="width100">
					{itemToEdit?"Update":"Create"}
				</Button>
			</Form>
		</Modal.Body>

	</Modal>
	);
};

export default ItemModal;
