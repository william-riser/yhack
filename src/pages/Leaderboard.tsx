import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface User {
    name: string;
    score: number;
}

const Leaderboard : React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = React.useState<User[]>([]);

    const getTopUsers = async () => {
        await axios.get('http://localhost:3000/getTopUsers')
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.error('Error fetching top users:', error);
            });
    }

        React.useEffect(() => {
            getTopUsers().then(() => console.log('done'));
            console.log(users);

    }, []);


    const handleProfile = () => {
        navigate('/profile');
    }

    return (
        <div>
            <div>
                <button onClick={handleProfile}>
                    Profile
                </button>
            </div>
            <h1>Leaderboard</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.score}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
        </div>
        </div>
    );
}

export default Leaderboard;