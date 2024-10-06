import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface receipt {
    score: string;
    date: string;
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
        navigate('/AddReceipt');
    };

    const calculateAverageScore = () => {
        let total = 0;
        if (user?.receipts.length === 0) return;
        user?.receipts.forEach(receipt => {
            total += parseInt(receipt.score);
        });
        const average = total / user?.receipts.length;
        setAverageScore(average);
    };

    useEffect(() => {
        calculateAverageScore();
    }, [user?.receipts]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const toLeaderboard = () => {
        navigate('/Leaderboard');
    };

    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100" 
            style={{
                backgroundImage: 'url(src/assets/bgbg.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-6">Profile</h2>
                {user ? (
                    <div>
                        <p className="text-gray-700 text-2xl mb-4">{user.name}</p>

                        {/* Circular progress bar for average score */}
                        <div className="w-40 h-40 mx-auto mb-6">
                            <CircularProgressbar
                                value={averageScore}
                                maxValue={100}
                                text={`${Math.round(averageScore)}%`}
                                styles={buildStyles({
                                    textSize: '16px',
                                    pathColor: averageScore >= 70 ? '#4caf50' : averageScore >= 40 ? '#ffc107' : '#f44336',
                                    textColor: '#333',
                                    trailColor: '#d6d6d6',
                                })}
                            />
                        </div>
                        <p className="text-gray-700 mb-6">Average Carbon Score</p>

                        <button
                            onClick={toLeaderboard}
                            className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mb-4 hover:bg-indigo-600 transition duration-300"
                        >  
                            View Leaderboard
                        </button>
                        <button
                            onClick={handleAddReceipt}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Add Receipt
                        </button>
                    </div>
                ) : (
                    <p className="text-red-500">No user information available</p>
                )}
                <button
                    onClick={handleLogout}
                    className="mt-4 text-red-500 hover:underline"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
