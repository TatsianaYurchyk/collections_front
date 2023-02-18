// import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Collection as CollectionModel } from "../models/collection";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface CollectionProps {
    collection: CollectionModel,
    // onNoteClicked: (collection: CollectionModel) => void,
    // onDeleteNoteClicked: (collection: CollectionModel) => void,
    className?: string,
}

const Collection = ({ collection,
    //  onNoteClicked, onDeleteNoteClicked, 
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
                    {topic}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            // onDeleteNoteClicked(collection);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
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