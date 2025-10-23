"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./Themetoggle";
import HamburgerMenu from "./HamburgerMenu";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-background border-b border-gray-300 dark:border-gray-700">
            <div className="container mx-auto flex items-center justify-between p-4">
                <span className="font-bold">Student No: 21808539</span>
                <nav>
                    <button
                        className="md:hidden p-2 border rounded"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle Menu"
                    >
                        ☰
                    </button>
                    <ul
                        className={`${open ? "block" : "hidden"
                            } absolute md:static top-14 right-4 md:flex gap-4 bg-background md:bg-transparent border md:border-0 p-4 md:p-0`}
                    >
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/prelab">Subject Review</Link>
                        </li>
                        <li>
                            <Link href="/escape-room">Courtroom Game</Link>
                        </li>
                        <li>
                            <Link href="/coding-races">Coding Races</Link>
                        </li>
                        <li>
                            <Link href="/about">About</Link>
                        </li>
                    </ul>
                </nav>
                <ThemeToggle />
                <HamburgerMenu />
            </div>
        </header>
    );
}