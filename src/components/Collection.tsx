import styles from "../styles/Collection.module.css";
// import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Collection as CollectionModel } from "../models/collection";
import { formatDate } from "../utils/formatDate";
import { MdBuild, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

interface CollectionProps {
    collection: CollectionModel,
    onCollectionClicked: (collection: CollectionModel) => void,
    onUpdateCollectionClicked: (collection: CollectionModel) => void,
    onDeleteCollectionClicked: (collection: CollectionModel) => void,
    className?: string,
    homePage: boolean,
}

const Collection = ({ collection,
    homePage,
    onCollectionClicked,
    onUpdateCollectionClicked,
    onDeleteCollectionClicked, 
     className }: CollectionProps) => {
    const {
        name,
        topic,
        description,
        createdAt,
        updatedAt
    } = collection;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.card} ${className}`}
            onClick={() => onCollectionClicked(collection)}
            >
            <Card.Body 
            // className={styles.cardBody}
            className="cardBody"
            >
                <Card.Title 
                className="flexEnd "
                >
                    {name}
                    {!homePage && <div>
                    <MdDelete
                        className="text-muted icon"
                        onClick={(e) => {
                            onDeleteCollectionClicked(collection);
                            e.stopPropagation();
                        }}
                    />
                    <MdBuild className="text-muted mar-l icon"
                      
                    onClick={(e) => {
                        onUpdateCollectionClicked(collection);
                        e.stopPropagation();
                    }}
                    />
                    </div>}
                </Card.Title>
                <Link to={`/collections/${collection._id}`} style={{ textDecoration: 'none' }}>
                <Card.Text 
                className={`${styles.cardText} ${className}`}
                >
                    topic: {topic}
                </Card.Text>
                <Card.Text 
                // className={styles.cardText}
                >
                    {description}
                </Card.Text>
                </Link>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Collection;