import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { UserNote } from "../models/userNote";
import { User } from "../models/user";
import { Topic } from "../models/topic";
import { Collection} from "../models/collection";

// const USER_API_URL = "https://collections-mern-api.onrender.com";
 const USER_API_URL = "http://localhost:8000";

async function fetchData(input: RequestInfo, init?: RequestInit, credentials?: RequestCredentials) {
    const response = await fetch(input, init );
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function fetchTopics(): Promise<Topic[]> {
    const response = await fetchData(`${USER_API_URL}/api/topics`, { method: "GET", credentials: 'include' });
    return response.json();
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users`, { method: "GET", credentials: 'include' });
    return response.json();
}

export interface CollectionInput {
    name: string,
    description: string,
    topic: string,
    fields?: Array<string>,
    userId:string,
}

export async function createCollection(collection: CollectionInput): Promise<Collection> {
    const response = await fetchData(`${USER_API_URL}/api/collections/create`,
        {
            method: "POST",
            credentials: 'include' ,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(collection),
        });
    return response.json();
}

// export async function fetchCollections(): Promise<Collection[]> {
//     const response = await fetchData(`${USER_API_URL}/api/collections`, { method: "GET", credentials: 'include' });
//     return response.json();
// }
export async function fetchCollections(userId: string): Promise<Collection[]> {
    const response = await fetchData(`${USER_API_URL}/api/collections/`+userId, { method: "GET", credentials: 'include' });
    return response.json();
}
export async function fetchCollectionsHomePage(): Promise<Collection[]> {
    const response = await fetchData(`${USER_API_URL}/api/collections/all/alles`, { method: "GET", credentials: 'include' });
    return response.json();
}

export async function updateCollection(collectionId: string, collection: CollectionInput): Promise<Collection> {
    const response = await fetchData(`${USER_API_URL}/api/collections/`+ collectionId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(collection),
        });
    return response.json();
}

export async function getCollection(collectionId: string): Promise<Collection> {
    const response = await fetchData(`${USER_API_URL}/api/collections/collectionId/`+ collectionId,
        {
            method: "GET", credentials: 'include'
          
        });
    return response.json();
}

export async function deleteCollection(collectionId: string) {
    await fetchData(`${USER_API_URL}/api/collections/` + collectionId, { method: "DELETE" });
}

