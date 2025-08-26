"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = localStorage.getItem("theme") || "light";
        setTheme(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
    }, []);

    function toggle() {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem("theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
    }

    return (
        <button
            onClick={toggle}
            className="ml-4 p-2 border rounded"
            aria-label="Toggle Dark Mode"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}