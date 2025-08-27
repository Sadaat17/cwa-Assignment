export default function AboutPage() {
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">About</h1>
            <p>Syed Mohammad Sadaat</p>
            <p>Student No: 21808539</p>

            {/* YouTube link */}
            <p className="mt-4">
                <a 
                    href="https://www.youtube.com/watch?v=VIDEO_ID" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 underline"
                >
                    How To Video (YouTube)
                </a>
            </p>
        </div>
    );
}
