import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface receipt {
    text: string;
    date : string;
}

// Define the structure of the user object
interface User {
    name: string;
    email: string;
    receipts: receipt[];
}

const Profile: React.FC = () => {
    const location = useLocation();
    const user: User | null = location.state?.user || JSON.parse(localStorage.getItem('user') || 'null');
    const navigate = useNavigate();


    const handleAddReceipt = () => {
        console.log('Add receipt clicked');
        navigate('/AddReceipt');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
                {user ? (
                    <div>
                        <p className="text-gray-700">Name: {user.name}</p>
                        <p className="text-gray-700">Email: {user.email}</p>
                        {user.receipts.map((receipt, i) => (
                            <p key={i} className="text-gray-700"><span className={"font-bold bg-blue-100"}>Receipt {i + 1}:</span> {receipt.text}</p>
                        ))}

                    </div>
                ) : (
                    <p className="text-red-500">No user information available</p>
                )}
                <button onClick={handleAddReceipt} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                    Add Receipt
                </button>
            </div>
        </div>
    );
};

export default Profile;