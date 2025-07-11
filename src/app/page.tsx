import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-8 border border-gray-700">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        🎭 Overlay Reaksi Interaktif
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Sistem overlay reaksi real-time untuk streaming OBS dengan kontrol dari ponsel
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
                            <div className="text-4xl mb-4">📱</div>
                            <h2 className="text-2xl font-bold mb-4">Halaman Kontrol</h2>
                            <p className="mb-6 opacity-90">
                                Buka di ponsel untuk mengirim reaksi ke stream
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/control"
                                    className="block bg-gray-800 text-green-400 font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center"
                                >
                                    Socket.IO Version →
                                </Link>
                                <Link
                                    href="/control-vercel"
                                    className="block bg-green-800 text-green-200 font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center"
                                >
                                    Vercel Version →
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                            <div className="text-4xl mb-4">🖥️</div>
                            <h2 className="text-2xl font-bold mb-4">Overlay OBS</h2>
                            <p className="mb-6 opacity-90">
                                Tambahkan sebagai Browser Source di OBS
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/overlay"
                                    className="block bg-gray-800 text-purple-400 font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center"
                                >
                                    Socket.IO Version →
                                </Link>
                                <Link
                                    href="/overlay-vercel"
                                    className="block bg-purple-800 text-purple-200 font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-center"
                                >
                                    Vercel Version →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg shadow-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Panduan Setup</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div>
                            <div className="text-2xl mb-2">1️⃣</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Jalankan Server</h4>
                            <p className="text-sm text-gray-600">
                                Pastikan aplikasi Next.js berjalan di port 3000
                            </p>
                        </div>
                        <div>
                            <div className="text-2xl mb-2">2️⃣</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Setup OBS</h4>
                            <p className="text-sm text-gray-600">
                                Tambahkan Browser Source dengan URL: <br />
                                <code className="bg-gray-100 px-1 rounded">http://localhost:3000/overlay</code>
                            </p>
                        </div>
                        <div>
                            <div className="text-2xl mb-2">3️⃣</div>
                            <h4 className="font-semibold text-gray-800 mb-2">Kontrol Ponsel</h4>
                            <p className="text-sm text-gray-600">
                                Buka halaman kontrol di ponsel dengan IP komputer: <br />
                                <code className="bg-gray-100 px-1 rounded">http://[IP]:3000/control</code>
                            </p>
                        </div>
                    </div>
                </div> */}

                <div className="w-full mt-8">
                    <footer className="bg-gray-800 rounded-lg shadow-xl p-6 text-center border border-gray-700">
                        <div className="text-gray-300">
                            <p className="text-sm">
                                Made with ❤️ by{' '}
                                <a
                                    href="https://hi.oktaa.my.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                                >
                                    oktaa.my.id
                                </a>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
