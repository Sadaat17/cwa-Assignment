export default function Footer() {
    const date = new Date().toLocaleDateString();
    return (
        <footer className="bg-background border-t border-gray-300 dark:border-gray-700 mt-8">
            <div className="container mx-auto p-4 text-center text-sm">
                © Syed Mohammad Sadaat, Student No: 21808539, {date}
            </div>
        </footer>
    );
}