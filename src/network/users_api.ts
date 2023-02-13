import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { UserNote } from "../models/userNote";
import { User } from "../models/user";

 const USER_API_URL = "https://collections-mern-api.onrender.com";
// const USER_API_URL = "http://localhost:8000";

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

export async function getLoggedInUser(): Promise<User> {
    // const response = await fetchData("/api/users", { method: "GET" });
    const response = await fetchData(`${USER_API_URL}/api/users`, { method: "GET", credentials: 'include' });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(signupcredentials: SignUpCredentials): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/signup`,
        {
            method: "POST",
            credentials: 'include' ,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupcredentials),
            
            // credentials: 'same-origin'
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(logincredentials: LoginCredentials): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/login`,
        {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logincredentials),
           
            // credentials: 'same-origin'
        });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST", credentials: 'include'  });
}

export async function fetchUsers(): Promise<UserNote[]> {
    const response = await fetchData(`${USER_API_URL}/api/users/admin/get`, { method: "GET", credentials: 'include' });
    return response.json();
}

export async function deleteUser(userId: string) {
    await fetchData(`${USER_API_URL}/api/users/admin/` + userId, { method: "DELETE", credentials: 'include'   });
}

export async function blockStatus(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/admin/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"status":"blocked"}),
            credentials: 'include' 
        });
    return response.json();
}

export async function activateStatus(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/admin/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"status":"active"}),
            credentials: 'include' 
        });
    return response.json();
}

export async function setAdmin(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/admin/togglerole/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"role":"admin"}),
            credentials: 'include' 
        });
    return response.json();
}

export async function setNotAdmin(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/admin/togglerole/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"role":"user"}),
            credentials: 'include' 
        });
    return response.json();
}