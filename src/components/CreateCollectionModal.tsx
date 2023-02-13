import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/users_api";
import * as CollectionsApi from "../network/collections_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import TextAreaInputField from "./form/TextAreaInputField";

import { useEffect, useState } from 'react';
import { UnauthorizedError } from "../errors/http_errors";
import { Topic as TopicModel } from "../models/topic";
import { CountertopsOutlined, Topic } from "@mui/icons-material";
import Select from 'react-select';
import { Collection } from "../models/collection";
import { CollectionInput } from "../network/collections_api";
import { Console } from "console";
// import { ValueType } from "react-select";



interface CreateCollectionModalProps {
    onDismiss: () => void,
    // onLoginSuccessful: (user: User) => void,
}

const CreateCollectionModal = ({ onDismiss }: CreateCollectionModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);
    const [topics, setTopics] = useState<TopicModel[]>([]);
    const [selectedOption, setSelectedOption] = useState<TopicModel |null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CollectionInput>();

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
        console.log(topics)
	}, []);

    useEffect(() => {
	topics.map(topic=>topic.value)
        console.log(topics)
	}, [topics]);

    async function onSubmit(input: CollectionInput) {
        try {
            let collectionResponse: Collection;
            // if (noteToEdit) {
            //     noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
            // } else {
                // collectionResponse = await CollectionsApi.createCollection(input);
                // console.log(input)
                if (selectedOption) {
               
                    input.topic=selectedOption.value;
                    if (input.topic) {

                //collectionResponse = await CollectionsApi.createCollection(input)};
                console.log(input)}
                // console.log(selectedOption.value)
            }
        
            // }
            // onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }


    function withEvent(func: Function): React.ChangeEventHandler<any> {
        return (event: React.ChangeEvent<any>) => {
          const { target } = event;
          func(target.value);
        };
      }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                Create a new Collection
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Name"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        // error={errors.username}
                    />
                    <TextAreaInputField
                        name="description"
                        label="Description"
                        type="text"
                        placeholder="Description"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        // error={errors.password}
                    />
                    <Form.Label> Choose Topic</Form.Label>
                   <Select
        defaultValue={selectedOption}
        
        // onChange={withEvent(setSelectedOption)}
        onChange={setSelectedOption}
        options={topics}
        name="topic"
        
        // register={register}
        // registerOptions={{ required: "Required" }}
      />




                         {/* <SelectField
                        name="topic"
                        label="Topic"
                        options={topics}
                        value={topics.find((c) => c.value === value)}
                        onChange={(val) => onchange(val.value)}
                        // {...topics.map(topic => (
                        //     <option key={topic._id} value={topic.name} >{topic.name}</option>
                        //   ))}
                        // type="text"
                        // placeholder="Description"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    /> */}
                   {/* <Form.Select id='productType' name='topic' defaultValue="Choose the topic " value={Topic.name} onChange={topicChangeHandler}>
              <option className="d-none" value="">
                Select the topic
              </option>
              {topics.map(topic => (
                <option key={topic._id} value={topic.name} >{topic.name}</option>
              ))}
               </Form.Select> */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="width100">
                        Create
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default CreateCollectionModal;