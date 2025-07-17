'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-white mb-2">Oops!</h1>
                <p className="text-gray-300 mb-6">Terjadi kesalahan yang tidak terduga.</p>
                <button
                    onClick={reset}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}
