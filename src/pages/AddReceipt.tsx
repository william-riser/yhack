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
    const [carbonScore, setCarbonScore] = useState<number | null>(null);
    const [cleanedText, setCleanedText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    

    const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

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

                // Step 1: Clean up text and fetch carbon score using OpenAI API
                fetchCleanedTextAndCarbonScore(text);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    // Exponential Backoff calculation
    const calculateBackoff = (retryCount: number) => {
        return Math.pow(2, retryCount) * 1000; // Exponential backoff (1s, 2s, 4s, etc.)
    };

    // Fetch cleaned text and carbon footprint using OpenAI API
    const fetchCleanedTextAndCarbonScore = async (rawText: string) => {
        const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
        const requestOpenAI = async (retryCount = 0) => {
            try {
                const prompt = `Do not repeat the prompt in any way, only do what instructed.
                Use your own methods to compute a carbon footprint score from 0 - 100, 
                0 being terrible and 100 being carbon neutral. NEW LINE
                Now give a calculated guess on the kgs of carbon emissions saved or carbon emission wasted (
                depending on carbonfootprint score of everything averaged out), taking into account the store and items
                ensure you give a number or range of kgs that could be saved more. Give a reason why you gave the score.
                An example would be: 
                "Carbon foodprint score: 38 NEW LINE
                Number of kgs of carbon emission (Either saved or wasted -> calculate this from above): 50kg wasted NEW LINE
                Reason for score: Too much meat (specifics please), not enough organic produce (more specific than this with numbers)" NEW LINE
                After this, write a 2 sentence recommendation about how can the user decrease their carbon footprint and
                increase their score.
                An example would be: 
                Recommendation: Buy more organic produce (either double, triple, etc.) and stop buying red meat (More specific than this but a recommendation is required)
                Format:
                Carbon foodprint score: ...
                NEW LINE
                Number of kgs of carbon emission: ...
                NEW LINE
                Recommendation to increase your score: ...

                here is the json format:
                {
                score: "",
                sumary: "",
                recommendations: "",
                }
                `;
    
                const openAIResponse = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-4o',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 5000,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${openAiApiKey}`,
                        },
                    }
                )
                const response = JSON.parse(openAIResponse);
    
                // Instead of further processing, directly set the cleaned text and score based on the OpenAI response
                const responseText = openAIResponse.data.choices[0].message.content;
                setCleanedText(responseText);  // Display the full response as cleaned text
                // Optionally, handle carbonScore extraction if it's structured explicitly in the response
    
            } catch (error) {
                if (error.response?.status === 429 && retryCount < 5) {
                    const backoff = calculateBackoff(retryCount);
                    console.log(`Rate limit exceeded. Retrying in ${backoff / 1000} seconds...`);
                    setTimeout(() => requestOpenAI(retryCount + 1), backoff);
                } else {
                    console.error('Error fetching cleaned text and carbon score:', error);
                    setMessage('Error fetching carbon footprint');
                }
            }
        };
    
        requestOpenAI();
    };
    

    // Process the OpenAI API response to extract the cleaned list and carbon score
    const processOpenAIResponse = (response: string) => {
        // Assume the response comes as cleaned text followed by scores
        const [cleaned, ...rest] = response.split('\n').filter(line => line.trim());
        
        // The first part of the response contains the cleaned text
        setCleanedText(cleaned);

        // Extract scores from the rest of the response
        const scores = rest.map(line => {
            const match = line.match(/(\d+)/);
            return match ? parseInt(match[0]) : 50; // Default to 50 if no score found
        });

        // Calculate the average carbon footprint score
        const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
        setCarbonScore(averageScore);
    };

    // Save the extracted text to MongoDB
    const handleSaveText = async () => {
        if (!text || !user) return;
        const email = user.email;
        setSaving(true);
        try {
            const response = await axios.post('http://localhost:3000/addReceipt', {
                email,
                text
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
        <div className="flex flex-col items-center justify-center bg-white-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Receipt OCR</h1>

            <p className="text-gray-600 mb-6">Drag & drop a file to upload or choose from your computer.</p>

            <div
                className="w-full max-w-lg border-2 border-dashed border-gray-300 rounded-lg bg-fill bg-center flex flex-col items-center justify-center hover:border-green-500 transition-colors duration-300"
                style={{
                    minHeight: '400px',
                    minWidth: '512px',
                }}
            >
                <div className="h-12 w-12 text-gray-400 mb-4" />
            </div>

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

            <div className={"flex items-center"}>
                {image && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
                        <img src={image} alt="Uploaded Receipt" className="w-64 h-auto rounded-lg shadow-md" />
                    </div>
                )}

                {cleanedText && (
                    <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Cleaned Receipt Text:</h3>
                        <p className="text-gray-600 text-center">{cleanedText}</p>
                    </div>
                )}

                {carbonScore !== null && (
                    <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Carbon Footprint Score:</h3>
                        <p className="text-gray-600 text-center">{carbonScore.toFixed(2)} / 100</p>
                    </div>
                )}

                {message && <p className="mt-2 text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default ReceiptOCR;

