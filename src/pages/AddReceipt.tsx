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
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Receipt OCR</h1>

            <div className="mb-6">
                <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700
                     hover:file:bg-blue-200"
                />
            </div>

            <button
                onClick={handleExtractText}
                disabled={!image || loading}
                className={`px-4 py-2 rounded-md text-white font-semibold 
          ${loading || !image ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
            >
                {loading ? 'Processing...' : 'Extract Text'}
            </button>

            <div className={"flex  items-center"}>
                {image && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
                        <img src={image} alt="Uploaded Receipt" className="w-64 h-auto rounded-lg shadow-md" />
                    </div>
                )}

                {text && (
                    <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Extracted Text:</h3>
                        <p className="text-gray-600 whitespace-pre-line">{text}</p>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveText}
                            disabled={saving || isSaved} // Disable button if saving or already saved
                            className={`mt-4 px-4 py-2 rounded-md text-white font-semibold 
                            ${saving || isSaved ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                          `}
                        >
                            {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                        </button>
                        {message && <p className="mt-2 text-center text-green-500">{message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptOCR;
