import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface receipt {
    score: string;
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
    const [averageScore, setAverageScore] = React.useState<number>(0);

    const handleAddReceipt = () => {
        console.log('Add receipt clicked');
        navigate('/AddReceipt');
    };

    const calculateAverageScore = () => {
        let total = 0;
        if (user?.receipts.length == 0) return;
        user?.receipts.forEach(receipt => {
            total += parseInt(receipt.score);
        });
        const average = total / user?.receipts.length;
        setAverageScore(average);
    }

    useEffect(() => {
        calculateAverageScore();
    }
    , [calculateAverageScore]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }

    function toLeaderboard() {
        navigate('/Leaderboard');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <button onClick={handleLogout}>
                Logout
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
                {user ? (
                    <div>
                        <p className="text-gray-700">Name: {user.name}</p>
                        <p className="text-gray-700">Email: {user.email}</p>
                        <p className="text-gray-700">Average Score: {averageScore}</p>

                    </div>
                ) : (
                    <p className="text-red-500">No user information available</p>
                )}
                <button onClick={toLeaderboard}>
                    Leaderboard
                </button>
                <button onClick={handleAddReceipt} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                    Add Receipt
                </button>
            </div>
        </div>
    );
};

export default Profile;