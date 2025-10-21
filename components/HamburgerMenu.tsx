'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './HamburgerMenu.module.css';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
            </div>
            <nav className={isOpen ? styles.menuOpen : styles.menu}>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default HamburgerMenu;