import { useEffect, useState } from "react";
import { APIService } from "../../services/api";
import { User } from "src/types";

const UserProfile = () => {
    const apiService = new APIService();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        (async () => {
            const userData = await apiService.fetchUsers();
            setUsers(userData);
        })();
    }, []);

    return <span className="user-profile">Hi, {users[0]?.name}</span>
};

export default UserProfile;