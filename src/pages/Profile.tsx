import React from 'react';
import { useLocation } from 'react-router-dom';

// Define the structure of the user object
interface User {
    name: string;
    email: string;
}

const Profile: React.FC = () => {
    const location = useLocation();
    const user: User | null = location.state?.user || JSON.parse(localStorage.getItem('user') || 'null');

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
                {user ? (
                    <div>
                        <p className="text-gray-700">Name: {user.name}</p>
                        <p className="text-gray-700">Email: {user.email}</p>
                        
                    </div>
                ) : (
                    <p className="text-red-500">No user information available</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
