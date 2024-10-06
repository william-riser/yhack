import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './index.css';
import Profile from "./pages/Profile.tsx";
import SignUp from "./pages/SignUp.tsx";
import AddReceipt from "./pages/AddReceipt.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/AddReceipt" element={<AddReceipt />} />
                <Route path={"Leaderboard"} element={<Leaderboard />} />
            </Routes>
        </div>
    );
}

export default App;
