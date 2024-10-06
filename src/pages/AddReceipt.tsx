import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { useLocation } from "react-router-dom";
import axios from 'axios';

interface User {
    name: string;
    email: string;
}

const ReceiptOCR: React.FC = () => {
    const location = useLocation();
    const user: User | null = location.state?.user || JSON.parse(localStorage.getItem('user') || 'null');
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false); // New state for tracking save status
    const [message, setMessage] = useState<string>('');

    // Handle image file input change
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Perform OCR on the uploaded image
    const handleExtractText = () => {
        if (!image) return;
        setLoading(true);

        Tesseract.recognize(
            image,
            'eng', // Set language to English
            {
                logger: (m) => console.log(m), // Optional: logs OCR progress
            }
        )
            .then(({ data: { text } }) => {
                setText(text);
                setLoading(false);
                setIsSaved(false); // Reset the saved state when new text is extracted
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    // Save the extracted text to MongoDB
    const handleSaveText = async () => {
        if (!text || !user) return;
        const email = user.email;
        setSaving(true);
        try {
            const response = await axios.post('http://localhost:3000/addReceipt', {
                email, text
            });

            if (response.status === 201) {
                setMessage('Receipt saved successfully!');
                setIsSaved(true); // Mark the receipt as saved
            } else {
                setMessage('Error saving receipt');
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            setMessage('Error saving receipt');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white-100 p-6" 
        style={{backgroundImage: `url('')`}}
        >
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Receipt OCR</h1>

            <p className="text-gray-600 mb-6">Drag & drop a file to upload or choose from your computer.</p>

            {/* Drag-and-Drop Box */}
            <div
                className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg bg-fill bg-center flex flex-col items-center justify-center hover:border-green-500 transition-colors duration-300"
                style={{
                    backgroundImage: `url('src/assets/9812024.png')`,
                    minHeight: '400px',  // Ensure the box is at least 400px tall
                    minWidth: '512px',   // Ensure the box is at least 512px wide
                }}
            >
                {/* Cloud Upload Icon */}
                <div className="h-12 w-12 text-gray-400 mb-4" />
            </div>

            {/* Flex Container for Choose File and Extract Text Buttons */}
            <div className="flex mt-6 space-x-4">
                <label
                    htmlFor="file-upload"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                    Choose File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />

                <button
                    onClick={handleExtractText}
                    disabled={!image || loading}
                    className={`px-4 py-2 rounded-md text-white font-semibold
                    ${loading || !image ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                    `}
                >
                    {loading ? 'Processing...' : 'Extract Text'}
                </button>
            </div>

            <div className={"flex  items-center"}>
                {image && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
                        <img src={image} alt="Uploaded Receipt" className="w-64 h-auto rounded-lg shadow-md" />
                    </div>
                )}

                {text && (
                    <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                        {/* Center the title */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Extracted Text:</h3>
                        
                        {/* Center the text */}
                        <div
                            className="text-gray-600 whitespace-pre-line overflow-y-auto text-center"
                            style={{ maxHeight: '200px' }}  // Adjust the height as needed
                        >
                            {text}
                        </div>

                        {/* Save Button (Centered) */}
                        <div className="flex justify-center mt-4">  
                            <button
                                onClick={handleSaveText}
                                disabled={saving || isSaved}
                                className={`px-4 py-2 rounded-md text-white font-semibold
                                ${saving || isSaved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                                `}
                            >
                                {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>

                        {message && <p className="mt-2 text-center text-green-500">{message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptOCR;
