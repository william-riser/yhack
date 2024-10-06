import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

interface User {
    name: string;
    email: string;
}

interface Receipt {
    score: string;
    scoreSummary: string;
}

const ReceiptOCR: React.FC = () => {
    const location = useLocation();
    const user: User | null = location.state?.user || JSON.parse(localStorage.getItem('user') || 'null');
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [cleanedText, setCleanedText] = useState<string>('');
    const [carbonFootprint, setCarbonFootprint] = useState<string>('');
    const [recommendations, setRecommendations] = useState<string>('');
    const [scoreSummary, setScoreSummary] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

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
        const requestOpenAI = async (retryCount = 0) => {
            try {
                const prompt = `Do not repeat the prompt in any way, only do what instructed.
                Use your own methods to compute a carbon footprint score from 0 - 100, 
                0 being terrible and 100 being carbon neutral.
                Now give a calculated guess on the kgs of carbon emissions saved or carbon emission wasted (
                depending on carbon footprint score of everything averaged out), taking into account the store and items
                ensure you give a number or range of kgs that could be saved more.
                

                here is the json format:
                
                {
                    score: "",
                    scoreSummary: "",
                    recommendations: "",
                }
                
                where score is the carbon footprint score from 0 - 100,
                scoreSummary is a summary of the carbon footprint score, 
                and recommendations are ways to reduce their carbon footprint based on the items and score.
                Do not include any additional information outside of the json format.
                Do not add any style or formatting to the text.
                Make sure the json is valid and correctly formatted.
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

                const jsonResponse = JSON.parse(openAIResponse.data.choices[0].message.content);

                const summary = jsonResponse.scoreSummary;
                const score = jsonResponse.score;
                const recommendations = jsonResponse.recommendations;
                setScoreSummary(summary);
                setCarbonFootprint(score);
                setRecommendations(recommendations);

                // Instead of further processing, directly set the cleaned text and score based on the OpenAI response
                const responseText = openAIResponse.data.choices[0].message.content;
                setCleanedText(responseText);  // Display the full response as cleaned text

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

        await requestOpenAI();
    };

    function handleSave() {
        if (!user) return;
        setSaving(true);

        const email = user.email;
        // Save the score to the /addReceipt endpoint
        axios.post('http://localhost:3000/addReceipt', {
            email: email,
            score: carbonFootprint,
        })
            .then(() => {
                setIsSaved(true);
                setSaving(false);
            })
            .catch((error) => {
                console.error('Error saving receipt:', error);
                setMessage('Error saving receipt');
                setSaving(false);

            });
    }

    const handleProfile = () => {
        navigate('/profile');
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6">
            <div>
                <button onClick={handleProfile}>
                    Profile
                </button>
            </div>
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

            {image && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Image:</h3>
                    <img src={image} alt="Uploaded Receipt" className="w-64 h-auto rounded-lg shadow-md" />
                </div>
            )}

            {scoreSummary && (
                <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Summary:</h3>
                    <p className="text-gray-600 text-center">{scoreSummary}</p>
                </div>
            )}

            {recommendations && (
                <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Recommendations:</h3>
                    <p className="text-gray-600 text-center">{recommendations}</p>
                </div>
            )}

            {carbonFootprint && (
                <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Carbon Footprint Score:</h3>
                    <p className="text-gray-600 text-center">{carbonFootprint}</p>
                </div>
            )}

            {message && <p className="mt-2 text-center text-red-500">{message}</p>}
            <button onClick={handleSave} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                Save
            </button>
        </div>
    );
};

export default ReceiptOCR;
