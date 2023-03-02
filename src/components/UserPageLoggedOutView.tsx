import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import * as CollectionsApi from "../network/collections_api";
import { Collection as CollectionModel } from "../models/collection";
import Collection from './Collection';


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
                const lastCollections=collections.reverse().slice(0,9);
	            setCollections(lastCollections);
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
        <Row xs={1} md={2} xl={3} className="gx-4 gy-4"
		>
            {collections.map(collection => (
                <Col key={collection._id}>
                    <Collection
                        collection={collection}
                        homePage={true}
                        // className={styles.note}
						onCollectionClicked={setCollectionToSee}
                        onUpdateCollectionClicked={()=>console.log("impossible")}
                        onDeleteCollectionClicked={()=>console.log("impossible")}
                    />
                </Col>
            ))}
        </Row>
    return (<>
    	<div className="page_container">
			<div className="d-flex justify-content-center">
			
			</div>
			<p className="text-center">Last added collections:</p> 

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