import axios from "axios";

export class APIService {
    private static desiUrl: string = 'http://localhost:5000';

    constructor() {
    }

    fetchUsers = async () => {
        const response = await fetch(`${APIService.desiUrl}/api/users`);
        if (response.ok) {
            const userData = await response.json();
            return userData;
        }
        throw new Error('Failed to fetch user profile');
    }

    fetchProducts = async () => {
        const response = await axios.get("/api/products", {
            method: "GET",
        }).then((res) => {
            return res.data;
        });
        return response;
    }
}