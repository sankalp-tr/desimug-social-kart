import React, { useEffect, useState } from 'react';
import type { User } from '../types';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch users');
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ maxWidth: 700, margin: '2rem auto' }}>
            <h2>Users</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Avatar</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} width={40} height={40} style={{ borderRadius: '50%' }} />
                                ) : (
                                    <span>No avatar</span>
                                )}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.name}</td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.email}</td>
                            <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;