import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { UserNote } from "../models/userNote";
import { User } from "../models/user";

const USER_API_URL = "https://collections-mern-api.onrender.com";
// const USER_API_URL = "http://localhost:8000";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
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
    const response = await fetchData(`${USER_API_URL}/api/users`, { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchUsers(): Promise<UserNote[]> {
    const response = await fetchData(`${USER_API_URL}/api/users/get`, { method: "GET" });
    return response.json();
}

export async function deleteUser(userId: string) {
    await fetchData(`${USER_API_URL}/api/users/` + userId, { method: "DELETE" });
}

export async function blockStatus(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"status":"blocked"}),
        });
    return response.json();
}

export async function activateStatus(userId: string): Promise<User> {
    const response = await fetchData(`${USER_API_URL}/api/users/` + userId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"status":"active"}),
        });
    return response.json();
}