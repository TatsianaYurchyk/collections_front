import { User } from "../models/user";
import { Topic as TopicModel } from "../models/topic";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import * as CollectionsApi from "../network/collections_api";
import CreateCollectionModal from "./CreateCollectionModal";
import { Collection as CollectionModel } from "../models/collection";
import Collection from './Collection';
import { Link } from "react-router-dom";

interface UserPageProps {
	loggedInUser: User;
	onLogoutSuccessful: () => void;
}

const UserPageLoggedInView = ({
	loggedInUser,
	onLogoutSuccessful,
}: UserPageProps) => {
	const [collections, setCollections] = useState<CollectionModel[]>([]);
	const [showCreateCollectionModal, setShowCreateCollectionModal] =useState(false);
	const [collectionsLoading, setCollectionsLoading] = useState(true);
    const [showCollectionsLoadingError, setShowCollectionsLoadingError] = useState(false);
	const [collectionToEdit, setCollectionToEdit] = useState<CollectionModel | null>(null);
	const [collectionToSee, setCollectionToSee] = useState<CollectionModel | null>(null);

	useEffect(() => {
	    async function loadCollections() {
	        try {
	            setShowCollectionsLoadingError(false);
	            setCollectionsLoading(true);
	            const collections = await CollectionsApi.fetchCollections();
	            setCollections(collections);
				// console.log(collections);
	        } catch (error) {
	            console.error(error);
	            setShowCollectionsLoadingError(true);
	        } finally {
	            setCollectionsLoading(false);
	        }
	    }
	    loadCollections();
	}, []);

	async function deleteCollection(collection: CollectionModel) {
        try {
            await CollectionsApi.deleteCollection(collection._id);
            setCollections(collections.filter(existingCollection => existingCollection._id !== collection._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

	const collectionsGrid =
        <Row xs={1} md={2} xl={3} className="gx-3"
		// className={`g-4 ${styles.notesGrid}`}
		>
            {collections.map(collection => (
                <Col key={collection._id}>
					{/* <Link to={`/collections/${collection._id}`}> */}
                    <Collection
                        collection={collection}
                        // className={styles.note}
						onCollectionClicked={setCollectionToSee}
                        onUpdateCollectionClicked={setCollectionToEdit}
                        onDeleteCollectionClicked={deleteCollection}
                    />
					{/* </Link> */}
                </Col>
            ))}
        </Row>

	return (
		<div className="page_container">
			<div className="d-flex justify-content-center">
				{/* {" "} */}
				<h1 className="center">
					{/* {" "} */}
					{loggedInUser.username}'s Personal Page
				</h1>
			</div>
			<p className="text-center">UserPageLoggedInView</p>

			<Button onClick={() => setShowCreateCollectionModal(true)}>
				{/* {" "} */}
				Create a new Collection
			</Button>

			{collectionsLoading && <Spinner animation='border' variant='primary' />}
            {showCollectionsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!collectionsLoading && !showCollectionsLoadingError &&
                <>
                    {collections.length > 0
                        ? collectionsGrid
                        : <p>You don't have any collections yet</p>
                    }
                </>
            }


			{showCreateCollectionModal && (
				<CreateCollectionModal
					onDismiss={() => setShowCreateCollectionModal(false)}
					onCollectionSaved={(newCollection) => {
						setCollections([...collections, newCollection]);
						setShowCreateCollectionModal(false);
					}}
				/>
			)}

				{collectionToEdit &&
                <CreateCollectionModal
                    collectionToEdit={collectionToEdit}
					
                    onDismiss={() => setCollectionToEdit(null)}
                    onCollectionSaved={(updatedCollection) => {
                        setCollections(collections.map(existingCollection => existingCollection._id === updatedCollection._id ? updatedCollection : existingCollection));
                        setCollectionToEdit(null);
                    }}
                />
            }	
		</div>
	);
};

export default UserPageLoggedInView;
