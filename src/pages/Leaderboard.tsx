import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
    name: string;
    score: number;
    country: string;
    imageUrl: string;
}

const Leaderboard: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = React.useState<User[]>([]);
    const [filter, setFilter] = React.useState<string>("all-time");

    // Function to generate a random score (either 45 or 65)
    const generateRandomScore = () => (Math.random() < 0.5 ? 45 : 65);

    // Function to generate a random number between 3 and 9
    const generateRandomMultiplier = () => Math.floor(Math.random() * 7) + 3; // Random number between 3 and 9

    const getTopUsers = async () => {
        await axios
            .get("http://localhost:3000/getTopUsers")
            .then((response) => {
                // Add random scores to each user and then sort them by score in descending order
                const usersWithScores = response.data.users.map((user: User) => ({
                    ...user,
                    score: generateRandomScore(),
                }));

                const sortedUsers = usersWithScores.sort((a: User, b: User) => b.score - a.score);
                setUsers(sortedUsers);
            })
            .catch((error) => {
                console.error("Error fetching top users:", error);
            });
    };

    React.useEffect(() => {
        getTopUsers();
    }, []);

    const handleProfile = () => {
        navigate("/profile");
    };

    // Handle filter change and update scores accordingly
    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        
        if (newFilter === "all-time") {
            // Multiply scores by a random number between 3 and 9 and sort in descending order
            const updatedUsers = users.map(user => ({
                ...user,
                score: user.score * generateRandomMultiplier(),
            }));

            const sortedUsers = updatedUsers.sort((a, b) => b.score - a.score);
            setUsers(sortedUsers);
        } else {
            // Reset to original scores or do nothing
            getTopUsers();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button style={styles.profileButton} onClick={handleProfile}>
                    Profile
                </button>
                <h1 style={styles.title}>Leaderboard</h1>
            </div>

            <div style={styles.filters}>
                <button
                    style={filter === "7-days" ? styles.activeFilter : styles.filter}
                    onClick={() => handleFilterChange("7-days")}
                >
                    Week
                </button>
                <button
                    style={filter === "30-days" ? styles.activeFilter : styles.filter}
                    onClick={() => handleFilterChange("30-days")}
                >
                    Month
                </button>
                <button
                    style={filter === "all-time" ? styles.activeFilter : styles.filter}
                    onClick={() => handleFilterChange("all-time")}
                >
                    All-time
                </button>
            </div>

            <div style={styles.leaderboard}>
                {users.map((user, index) => (
                    <div key={index} style={styles.userRow}>
                        <div style={styles.rank}>{index + 1}</div>
                        <div style={styles.userDetails}>
                            <div>
                                <div style={styles.userName}>{user.name}</div>
                                <div style={styles.country}>{user.country}</div>
                            </div>
                        </div>
                        <div style={styles.score}>{user.score}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center" as "center",
        padding: "20px",
        backgroundImage: 'url("src/assets/run.webp")', // Add your background image path here
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh", // Ensure the background covers the full page height
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold" as "bold",
    },
    profileButton: {
        position: "absolute" as "absolute",
        left: "20px",
        top: "20px",
        padding: "10px 20px",
        borderRadius: "20px",
        backgroundColor: "#5cb85c",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    filters: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    filter: {
        margin: "0 10px",
        padding: "10px 20px",
        borderRadius: "20px",
        backgroundColor: "#f1f1f1",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "background-color 0.3s ease",
    },
    activeFilter: {
        margin: "0 10px",
        padding: "10px 20px",
        borderRadius: "20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
    },
    leaderboard: {
        width: "40%", // Reduced the width to 40%
        margin: "auto",
    },
    userRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 15px", // Reduced padding to make rows more compact
        marginBottom: "10px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease",
    },
    rank: {
        fontSize: "1.3rem", // Adjusted font size to make it fit better
        fontWeight: "bold" as "bold",
        color: "#333",
        flex: "0 0 50px", // Fixed width for rank
    },
    userDetails: {
        display: "flex",
        alignItems: "center",
        flex: "1", // Flex to take up available space
    },
    userName: {
        fontSize: "1.1rem", // Adjusted size for compact display
        fontWeight: "bold" as "bold",
        color: "#333",
    },
    country: {
        fontSize: "0.85rem",
        color: "#666",
    },
    score: {
        fontSize: "1.3rem", // Adjusted to match the rank
        fontWeight: "bold" as "bold",
        color: "#5cb85c",
        flex: "0 0 100px", // Fixed width for score
        textAlign: "right" as "right",
    },
};

export default Leaderboard;
