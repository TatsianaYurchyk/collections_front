// import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Collection as CollectionModel } from "../models/collection";
import { formatDate } from "../utils/formatDate";
import { MdBuild, MdDelete } from "react-icons/md";

interface CollectionProps {
    collection: CollectionModel,
    onUpdateCollectionClicked: (collection: CollectionModel) => void,
    onDeleteCollectionClicked: (collection: CollectionModel) => void,
    className?: string,
}

const Collection = ({ collection,
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
            // className={`${styles.noteCard} ${className}`}
            // onClick={() => onNoteClicked(collection)}
            >
            <Card.Body 
            // className={styles.cardBody}
            >
                <Card.Title 
                // className={styleUtils.flexCenter}
                >
                    {name}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteCollectionClicked(collection);
                            e.stopPropagation();
                        }}
                    />
                    <MdBuild className="text-muted ms-auto"
                    onClick={(e) => {
                        onUpdateCollectionClicked(collection);
                        e.stopPropagation();
                    }}
                    />
                </Card.Title>
                <Card.Text 
                // className={styles.cardText}
                >
                    topic: {topic}
                </Card.Text>
                <Card.Text 
                // className={styles.cardText}
                >
                    {description}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Collection;