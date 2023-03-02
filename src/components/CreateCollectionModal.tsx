import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/users_api";
import * as CollectionsApi from "../network/collections_api";
import { Alert, Button, Form, ListGroup, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import TextAreaInputField from "./form/TextAreaInputField";

import { createRef, Key, useEffect, useRef, useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";
import { Topic as TopicModel } from "../models/topic";
import { CountertopsOutlined, Topic } from "@mui/icons-material";
import Select from "react-select";
import { Collection } from "../models/collection";
import { CollectionInput } from "../network/collections_api";
import { Console } from "console";
import { idText } from "typescript";
import InputGroup from "react-bootstrap/InputGroup";

interface CreateCollectionModalProps {
	collectionToEdit?: Collection;
	onDismiss: () => void;
	onCollectionSaved: (note: Collection) => void;
	loggedInUserId: string;
}

const CreateCollectionModal = ({
	collectionToEdit,
	onDismiss,
	onCollectionSaved,
	loggedInUserId,
}: CreateCollectionModalProps) => {
	const [errorText, setErrorText] = useState<string | null>(null);
	const [topics, setTopics] = useState<TopicModel[]>([]);
	const [selectedOption, setSelectedOption] = useState<TopicModel | null>(null);
	const [formValues, setFormValues] = useState<any[]>([]);
	const [toggle, setToggle] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CollectionInput>({
		defaultValues: {
			topic: collectionToEdit?.topic || "",
			description: collectionToEdit?.description || "",
			name: collectionToEdit?.name || "",
			fields: collectionToEdit?.fields || [],
		},
	});

	useEffect(() => {
		async function loadTopics() {
			try {
				const topics = await CollectionsApi.fetchTopics();
				setTopics(topics);
			} catch (error) {
				console.error(error);
			}
		}
		loadTopics();
	}, []);

	useEffect(() => {
		topics.map((topic) => topic.value);
	}, [topics]);

	useEffect(() => {
		async function loadCollection() {
			try {
				if (collectionToEdit) {
					const collection = await CollectionsApi.getCollection(
						collectionToEdit._id
					);
					setFormValues(collection.fields);
					const newTopic = topics.find(
						(topic) => topic.value == collection.topic
					);
					newTopic
						? setSelectedOption(newTopic)
						: setSelectedOption(null);
				} else {
					setFormValues([]);
					setSelectedOption(null);
				}
			} catch (error) {
				console.error(error);
			}
		}
		loadCollection();
	}, [topics]);

	// const inputRef = useRef();
	const inputRef = createRef<HTMLInputElement>();

	const handleAddField = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		const values = [...formValues];
		if (inputRef.current) {
			if (inputRef.current.value) {
				values.push(inputRef.current.value);
				setFormValues(values);
				setToggle(false);
				console.log(inputRef.current.value);
				console.log(values);
			} else {
				setToggle(false);
			}
		}
	};

	const addBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setToggle(true);
	};

	const deleteField = (index: any) => {
		const values = [...formValues];
		values.splice(index, 1);
		setFormValues(values);
	};

	async function onSubmit(input: CollectionInput) {
		try {
			let collectionResponse: Collection;
			if (!collectionToEdit) {
				if (selectedOption) {
					input.topic = selectedOption.value;

					if (input.topic) {
						input.fields = formValues;
						input.userId = loggedInUserId;

						console.log(input);
						collectionResponse =
							await CollectionsApi.createCollection(input);

						onCollectionSaved(collectionResponse);
						console.log(input);
					}
				}
			} else if (selectedOption) {
				input.topic = selectedOption.value;
				if (input.topic) {
					input.fields = formValues;
					console.log(input);

					collectionResponse = await CollectionsApi.updateCollection(
						collectionToEdit._id,
						input
					);
					onCollectionSaved(collectionResponse);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header closeButton className="modalBody">
				<Modal.Title>Create a new Collection</Modal.Title>
			</Modal.Header>

			<Modal.Body className="modalBody">
				{errorText && <Alert variant="danger">{errorText}</Alert>}
				<Form onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name="name"
						label="Name"
						type="text"
						placeholder="Name"
						register={register}
						registerOptions={{ required: "Required" }}
					/>
					<TextAreaInputField
						name="description"
						label="Description"
						type="text"
						placeholder="Description"
						register={register}
						registerOptions={{ required: "Required" }}
					/>
					{collectionToEdit && selectedOption ? (
						<Form.Label>
							{" "}
							The collections's topic is {selectedOption.value}.
							If you want you can change it:
						</Form.Label>
					) : (
						""
					)}
					<Form.Label> Choose Topic</Form.Label>

					<Select
						className="addMargin"
						defaultValue={selectedOption}
						onChange={setSelectedOption}
						options={topics}
						name="topic"
					/>

					{formValues.length ? (
						<Form.Label> Additional Fields</Form.Label>
					) : (
						""
					)}

					<ListGroup variant="flush" className="flexEnd">
						{formValues.map((field) => (
							<ListGroup.Item
								key={field.toString()}
								className="flexEnd">
								<div>{field}</div>
								<div
									onClick={() =>
										deleteField(formValues.indexOf(field))
									}>
									X
								</div>
							</ListGroup.Item>
						))}
					</ListGroup>

					{!toggle ? (
						<Button
							className="addMargin buttonColor"
							onClick={addBtnClick}
							variant="secondary">
							Add new field
						</Button>
					) : (
						<InputGroup className="mb-3">
							<Form.Control
								type="text"
								placeholder="FieldName for collection's item"
								ref={inputRef}
							/>
							<Button
								variant="outline-secondary"
								className="add-btn"
								onClick={handleAddField}>
								Add
							</Button>
						</InputGroup>
					)}

					<Button
						type="submit"
						disabled={isSubmitting}
						className="width100 buttonColor">
						{collectionToEdit ? "Update" : "Create"}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default CreateCollectionModal;
