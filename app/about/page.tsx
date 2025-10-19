export default function AboutPage() {
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">About</h1>
            <p>Syed Mohammad Sadaat</p>
            <p>Student No: 21808539</p>

            {/* YouTube Video Link */}
            <h2 className="text-lg font-semibold mt-6 mb-2">Video Demonstration</h2>
            <a
                href="https://youtu.be/fLIrzZO0VxM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
            >
                Watch my video on YouTube
            </a>
        </div>
    );
}