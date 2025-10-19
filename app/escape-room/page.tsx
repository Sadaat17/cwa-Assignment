"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CourtroomGame() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState<any>(null);
    const [urgentIgnoreCount, setUrgentIgnoreCount] = useState(0);
    const [scene, setScene] = useState<"office" | "courtroom">("office");
    const [customTimer, setCustomTimer] = useState(60);
    const [codeIndex, setCodeIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [showError, setShowError] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState(0);

    // Python Debugging Challenges
    const debugChallenges = [
        {
            question: "Fix the syntax error in this Python code:",
            code: `def greet(name):\n    print("Hello " + name`,
            correctAnswer: `def greet(name):\n    print("Hello " + name)`,
            hint: "Missing closing parenthesis",
        },
        {
            question: "Fix the indentation error:",
            code: `def calculate():\nreturn 5 + 3`,
            correctAnswer: `def calculate():\n    return 5 + 3`,
            hint: "Python requires proper indentation",
        },
        {
            question: "Fix the list index error:",
            code: `numbers = [1, 2, 3]\nprint(numbers[3])`,
            correctAnswer: `numbers = [1, 2, 3]\nprint(numbers[2])`,
            hint: "List indices start at 0",
        },
        {
            question: "Fix the variable name error:",
            code: `user-name = "John"\nprint(user-name)`,
            correctAnswer: `user_name = "John"\nprint(user_name)`,
            hint: "Variable names cannot contain hyphens",
        },
        {
            question: "Fix the string concatenation error:",
            code: `age = 25\nprint("Age: " + age)`,
            correctAnswer: `age = 25\nprint("Age: " + str(age))`,
            hint: "Convert integer to string",
        },
    ];

    const currentChallenge = debugChallenges[codeIndex];

    // Normal & urgent messages
    const normalMessages = [
        { sender: "Boss", text: "Are you done with sprint 1?" },
        { sender: "Family", text: "Can you pick up the kids after work?" },
        { sender: "Teammate", text: "Hey, push your latest code please." },
        { sender: "HR", text: "Reminder: Submit your timesheet today." },
        { sender: "Colleague", text: "Coffee break in 5 minutes?" },
    ];

    const urgentMessage = {
        sender: "Accessibility Officer",
        text: "URGENT: Fix alt attribute in img1 immediately!",
        urgent: true,
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (running && scene === "office" && time < customTimer) {
            interval = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        }
        if (time >= customTimer) {
            setRunning(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [running, scene, time, customTimer]);

    // Pop-up messages every 15 seconds
    useEffect(() => {
        if (!running || scene === "courtroom") return;

        if (time > 0 && time % 15 === 0 && time !== lastMessageTime) {
            setLastMessageTime(time);

            // If user has ignored once, show urgent again
            // Otherwise, 25% chance of urgent message
            const showUrgent = urgentIgnoreCount > 0 || Math.random() < 0.25;

            if (showUrgent) {
                setMessage(urgentMessage);
            } else {
                const randomMsg =
                    normalMessages[Math.floor(Math.random() * normalMessages.length)];
                setMessage(randomMsg);
            }
        }
    }, [time, running, scene, urgentIgnoreCount, lastMessageTime]);

    // Handle notification reply
    const handleReply = (reply: string) => {
        if (message?.urgent) {
            if (reply === "respond") {
                setUrgentIgnoreCount(0);
                setMessage(null);
            } else {
                // User ignored
                const newCount = urgentIgnoreCount + 1;
                setUrgentIgnoreCount(newCount);

                if (newCount >= 2) {
                    // Second ignore triggers courtroom
                    setScene("courtroom");
                    setMessage(null);
                    setRunning(false);
                } else {
                    setMessage(null);
                }
            }
        } else {
            setMessage(null);
        }
    };

    // Submit code answer
    const handleSubmitCode = () => {
        // Normalize whitespace for comparison
        const normalizedAnswer = userAnswer.trim().replace(/\s+/g, ' ');
        const normalizedCorrect = currentChallenge.correctAnswer.trim().replace(/\s+/g, ' ');

        if (normalizedAnswer === normalizedCorrect) {
            // Correct answer
            setShowError(false);
            setUserAnswer("");

            // Move to next challenge
            if (codeIndex < debugChallenges.length - 1) {
                setCodeIndex(codeIndex + 1);
            } else {
                // All challenges completed
                alert("🎉 Congratulations! You've completed all debugging challenges!");
                setCodeIndex(0); // Reset to first challenge
            }
        } else {
            // Wrong answer
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }
    };

    // Reset game
    const resetGame = () => {
        setScene("office");
        setUrgentIgnoreCount(0);
        setTime(0);
        setMessage(null);
        setCodeIndex(0);
        setUserAnswer("");
        setShowError(false);
        setLastMessageTime(0);
        setRunning(false);
    };

    return (
        <div
            className="w-screen h-screen flex flex-col items-center justify-center relative"
            style={{
                backgroundImage:
                    scene === "courtroom"
                        ? "url('/courtroom.jpg')"
                        : running
                            ? "url('/workdesk.jpg')"
                            : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: !running && scene === "office" ? "#f3f4f6" : "transparent",
            }}
        >
            {/* Office Scene */}
            {scene === "office" && (
                <>
                    {/* Timer Setup Screen (Before Start) */}
                    {!running && (
                        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center w-[500px]">
                            <h1 className="text-4xl font-bold mb-6 text-gray-800">
                                Courtroom Debugging Game
                            </h1>

                            {/* Timer Settings */}
                            <div className="flex flex-col items-center gap-3 mb-6">
                                <label className="font-semibold text-gray-700 text-lg">
                                    Set Timer (seconds)
                                </label>
                                <input
                                    type="number"
                                    value={customTimer}
                                    onChange={(e) => setCustomTimer(Number(e.target.value))}
                                    className="border-2 border-gray-300 rounded-lg px-3 py-2 text-center w-32 text-lg font-mono"
                                />
                            </div>

                            <button
                                onClick={() => setRunning(true)}
                                className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition"
                            >
                                ▶ Start Timer
                            </button>
                        </div>
                    )}

                    {/* Game Screen (After Start) */}
                    {running && (
                        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center w-[600px] max-h-[90vh] overflow-y-auto">
                            <h1 className="text-3xl font-bold mb-3 text-gray-800">
                                Courtroom Debugging Game
                            </h1>

                            <p className="mb-4 text-xl text-gray-700">
                                Time: <span className="font-mono font-bold">{time}s</span> /{" "}
                                {customTimer}s
                            </p>

                            <button
                                onClick={() => setRunning(false)}
                                className="px-6 py-2 bg-red-600 text-white text-lg rounded-xl hover:bg-red-700 transition mb-6"
                            >
                                ⏸ Pause Timer
                            </button>

                            {/* Debugging Challenge Section */}
                            <div className="mt-6 text-left bg-gray-100 p-6 rounded-xl shadow-inner">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        🐍 Python Challenge {codeIndex + 1}/{debugChallenges.length}
                                    </h2>
                                </div>

                                <p className="text-gray-700 mb-3 font-medium">
                                    {currentChallenge.question}
                                </p>

                                {/* Code Display */}
                                <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm mb-4 whitespace-pre">
                                    {currentChallenge.code}
                                </div>

                                {/* Answer Input */}
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Fixed Code:
                                </label>
                                <textarea
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type the corrected code here..."
                                    className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg font-mono text-sm bg-white resize-none focus:border-blue-500 focus:outline-none"
                                />

                                {/* Error Message */}
                                {showError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <span className="text-xl">❌</span>
                                        <span className="font-semibold">
                                            Incorrect! Try again. Hint: {currentChallenge.hint}
                                        </span>
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleSubmitCode}
                                    className="mt-4 w-full px-4 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition"
                                >
                                    Submit Code
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Courtroom Scene */}
            {scene === "courtroom" && (
                <motion.div
                    className="bg-white/95 p-12 rounded-2xl shadow-2xl text-center max-w-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1
                        className="text-6xl font-bold text-red-700 mb-6"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        ⚖️ COURTROOM ⚖️
                    </motion.h1>
                    <div className="bg-red-50 border-4 border-red-600 rounded-xl p-8 mb-6">
                        <p className="text-2xl font-bold text-gray-800 mb-4">
                            You have been fined for breaking the Disability Act.
                        </p>
                        <p className="text-lg text-gray-700">
                            You ignored urgent accessibility violations twice.
                        </p>
                    </div>
                    <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                        Return to Office & Try Again
                    </button>
                </motion.div>
            )}

            {/* Message Popups */}
            <AnimatePresence>
                {message && scene === "office" && (
                    <motion.div
                        key="popup"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-10 right-10 bg-white shadow-2xl p-6 rounded-2xl border-2 w-[380px] z-50"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-lg text-gray-800">
                                {message.sender}
                            </span>
                            {message.urgent && (
                                <motion.span
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full"
                                >
                                    🚨 URGENT
                                </motion.span>
                            )}
                        </div>
                        <p className="text-gray-700 mb-4 text-base">{message.text}</p>
                        {message.urgent ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleReply("respond")}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                                >
                                    ✓ Respond
                                </button>
                                <button
                                    onClick={() => handleReply("ignore")}
                                    className="flex-1 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition"
                                >
                                    ✕ Ignore
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setMessage(null)}
                                className="w-full px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
                            >
                                Close
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}