import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateAccount : React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const user = { name, email, password };

        try {
            const response = await axios.post('http://localhost:3000/addUser', user);

            if (response.status === 201) {
                setMessage('User created successfully!');
                navigate('/');
            } else {
                setMessage(response.data.message || 'Error creating user');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error creating user');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign up</h2>
                <form onSubmit={handleSubmit}>
                <div className="relative mb-6">
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="peer w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=" "
                    />
                    <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-600 top-3 left-3 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all duration-300"
                    >
                    Name
                    </label>
                </div>

                <div className="relative mb-6">
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="peer w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="peer w-full px-3 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder=" "
                    />
                    <label
                    htmlFor="password"
                    className="absolute text-sm text-gray-600 top-3 left-3 transform -translate-y-3 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 transition-all duration-300"
                    >
                    Password
                    </label>
                    <div className='mt-4'>                    
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                            Remember for 30 days
                        </label>
                    </div>

                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 "
                    style={{ backgroundColor: '#5D9E57' }}
                >
                    Sign up
                </button>
                </form>

                {message && <p className="text-center text-green-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default CreateAccount;
