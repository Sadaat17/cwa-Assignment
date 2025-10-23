'use client';

import { useState } from 'react';

export default function PrelabPage() {
    const [review, setReview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchLambdaReview = async () => {
        setLoading(true);
        setError('');
        setReview('');

        try {
            const response = await fetch('https://68hrbqi2ij.execute-api.us-east-1.amazonaws.com/Dev');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Parse the response - the body contains a stringified string
            const reviewText = typeof data.body === 'string'
                ? JSON.parse(data.body)
                : data.body;

            setReview(reviewText);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">


            <button
                onClick={fetchLambdaReview}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 disabled:transform-none"
            >
                {loading ? 'Loading...' : 'Click to see subject Review via lambda'}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {review && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-2 text-green-800">Subject Review:</h2>
                    <p className="text-gray-700 text-lg">{review}</p>
                </div>
            )}
        </div>
    );
}