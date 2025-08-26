export default function AboutPage() {
    return (
        <div>
            <h1 className="text-xl font-bold mb-4">About</h1>
            <p>Syed Mohammad Sadaat</p>
            <p>Student No: 21808539</p>
            <video controls className="mt-4 w-full max-w-lg">
                <source src="/howto.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}