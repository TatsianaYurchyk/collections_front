import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { UserNote } from "../models/userNote";
import { User } from "../models/user";
import { Topic } from "../models/topic";
import { Item } from "../models/item";
import { Collection} from "../models/collection";

 const USER_API_URL = "https://collections-mern-api.onrender.com";
//   const USER_API_URL = "http://localhost:8000";

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

export interface ItemInput {
    name: string,
    collectionId:string
    // [key: string]: string,
    properties: Object
}

export async function createItem(item: ItemInput): Promise<Item> {
    const response = await fetchData(`${USER_API_URL}/api/collections/items/create`,
        {
            method: "POST",
            credentials: 'include' ,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        });
    return response.json();
}

export async function fetchItems(collectionId: string): Promise<Item[]> {
    const response = await fetchData(`${USER_API_URL}/api/collections/items/`+ collectionId, { method: "GET", credentials: 'include' });
    return response.json();
}

export async function updateItem(itemId: string, item: ItemInput): Promise<Item> {
    const response = await fetchData(`${USER_API_URL}/api/collections/`+ itemId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        });
    return response.json();
}

export async function getItem(itemId: string): Promise<Item> {
    const response = await fetchData(`${USER_API_URL}/api/collections/`+ itemId,
        {
            method: "GET", credentials: 'include'
          
        });
    return response.json();
}

export async function deleteItem(itemId: string) {
    await fetchData(`${USER_API_URL}/api/collections/items/` + itemId, { method: "DELETE" });
}

