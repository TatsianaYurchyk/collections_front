import { User } from "../models/user";
import { Topic as TopicModel } from "../models/topic";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import * as CollectionsApi from "../network/collections_api";
import CreateCollectionModal from "./CreateCollectionModal";
import { Collection as CollectionModel } from "../models/collection";
import Collection from './Collection';
import { Link } from "react-router-dom";


const UserPageLoggedOutView = () => {
    const [collections, setCollections] = useState<CollectionModel[]>([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);
    const [showCollectionsLoadingError, setShowCollectionsLoadingError] = useState(false);
    const [collectionToSee, setCollectionToSee] = useState<CollectionModel | null>(null);

    useEffect(() => {
	    async function loadCollections() {
	        try {
	            setShowCollectionsLoadingError(false);
	            setCollectionsLoading(true);
	            const collections = await CollectionsApi.fetchCollectionsHomePage();
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

    const collectionsGrid =
        <Row xs={1} md={2} xl={3} className="gx-3"
		// className={`g-4 ${styles.notesGrid}`}
		>
            {collections.map(collection => (
                <Col key={collection._id}>
					<Link to={`/collections/${collection._id}`}>
                    <Collection
                        collection={collection}
                        // className={styles.note}
						onCollectionClicked={setCollectionToSee}
                        onUpdateCollectionClicked={()=>console.log("impossible")}
                        onDeleteCollectionClicked={()=>console.log("impossible")}
                    />
					</Link>
                </Col>
            ))}
        </Row>
    return (<>
    	<div className="page_container">
			<div className="d-flex justify-content-center">
			
			</div>
			<p className="text-center">The biggest collections:</p> 

			

			{collectionsLoading && <Spinner animation='border' variant='primary' />}
            {showCollectionsLoadingError && <p>Something went wrong. Please refresh the page.</p>}
            {!collectionsLoading && !showCollectionsLoadingError &&
                <>
                   
                        { collectionsGrid}
                       
                    
                </>
            }


			

				
            
		</div>
            

            </>
    );
}

export default UserPageLoggedOutView;