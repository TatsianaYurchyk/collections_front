import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/users_api";
import * as CollectionsApi from "../network/collections_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
// import SelectField from "./form/SelectField";
import { useEffect, useState } from 'react';
import { UnauthorizedError } from "../errors/http_errors";
import { Topic as TopicModel } from "../models/topic";
import { Topic } from "@mui/icons-material";
import Select from 'react-select';


interface CreateCollectionModalProps {
    onDismiss: () => void,
    // onLoginSuccessful: (user: User) => void,
}

const CreateCollectionModal = ({ onDismiss }: CreateCollectionModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);
    const [topics, setTopics] = useState<TopicModel[]>([]);
    const [selectedOption, setSelectedOption] = useState<TopicModel |null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

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

    async function onSubmit() {
        try {
            const user = await CollectionsApi.fetchTopics();
            // onLoginSuccessful(user);
            // localStorage.setItem("loggedInUser", JSON.stringify(user))
        } catch (error) {
            // if (error instanceof UnauthorizedError) {
            //     setErrorText(error.message);
            // } else {
            //     alert(error);
            // }
            console.error(error);
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
                        error={errors.username}
                    />
                    <TextInputField
                        name="description"
                        label="Description"
                        type="text"
                        placeholder="Description"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                    <Form.Label> Choose Topic</Form.Label>
                   <Select
        defaultValue={selectedOption}
        
        // onChange={withEvent(setSelectedOption)}
        onChange={setSelectedOption}
        options={topics}
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