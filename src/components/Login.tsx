import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the structure of the user object
interface User {
    name: string;
    email: string;
    password?: string; // Optional because we may not need to store it after login
}



const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });

            if (response.status === 200) {
                const userData: User = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));

                navigate('/profile', { state: { user: userData } });
            } else {
                setMessage('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Error during login');
        }
    };

    function handleNewUser() {
        navigate('/SignUp');
    }

    return (
        <div className="flex min-h-screen">
            {/* Left side with background pattern */}
            <div className="w-1/2 bg-black">
                <div
                    className="h-full"
                    style={{
                        backgroundImage: "url('src/assets/bg.jpg')", // Add your diagonal pattern image here
                        backgroundSize: 'cover',
                    }}
                ></div>
            </div>
        {/* Right side with the login form */}
        <div className="w-1/2 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-3xl font-bold text-center mb-4">Carbon Foodprint</h2>
                    <p className="text-center mb-6 text-gray-500">Welcome back!</p>

                    <form onSubmit={handleLogin}>
                        <div className="relative mb-6">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="peer w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder=" "
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-gray-600 top-3 left-3 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all duration-300"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="peer w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder=" "
                            />
                            <label
                                htmlFor="password"
                                className="absolute text-sm text-gray-600 top-3 left-3 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all duration-300"
                            >
                                Password
                            </label>
                        </div>

                        <div className="flex justify-between items-center mt-3 mb-14">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                    Remember for 30 days
                                </label>
                            </div>
                            <a href="#" className="text-sm text-green-500 hover:underline" style={{ color: '#5D9E57' }}>
                                Forgot password?
                            </a>

                        </div>

                        <button
                            type="submit"
                            className="w-full text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
                            style={{ backgroundColor: '#5D9E57' }}  // Custom background color
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Google Sign In */}
                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition duration-300"
                        >
                            <img src="src/assets/google-icon.png" alt="Google Icon" className="w-5 h-5 mr-2" />
                            Sign in with Google
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-4">
                        Don’t have an account?{' '}
                        <span onClick={handleNewUser} className="text-green-500 hover:underline cursor-pointer" style={{ color: '#5D9E57' }}>
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
