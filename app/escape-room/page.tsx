"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Challenge {
    buggyCode: string;
    correctAnswer: string;
}

// SVG Icon Components
const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14zm-1 6h2v4h-2v-4zm0 6h2v2h-2v-2z" />
    </svg>
);

const RocketIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c3 0 8 2 8 9 0 3-2 6-4 8l-1 3h-6l-1-3c-2-2-4-5-4-8 0-7 5-9 8-9zm0 2c-2 0-6 1-6 7 0 2 1 4 3 6h6c2-2 3-4 3-6 0-6-4-7-6-7zm0 3c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z" />
    </svg>
);

const BackArrowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const TimerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="13" r="9" />
        <polyline points="12 7 12 13 16 15" />
        <path d="M9 2h6" />
    </svg>
);

const CodeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

export default function CourtroomGame() {
    // Builder State
    const [mode, setMode] = useState<"builder" | "game">("builder");
    const [builderTimer, setBuilderTimer] = useState(60);
    const [challenges, setChallenges] = useState<Challenge[]>([
        { buggyCode: "", correctAnswer: "" },
        { buggyCode: "", correctAnswer: "" },
        { buggyCode: "", correctAnswer: "" },
        { buggyCode: "", correctAnswer: "" },
        { buggyCode: "", correctAnswer: "" },
    ]);

    // Game State
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState<{ sender: string, text: string, urgent?: boolean } | null>(null);
    const [urgentIgnoreCount, setUrgentIgnoreCount] = useState(0);
    const [scene, setScene] = useState<"office" | "courtroom">("office");
    const [codeIndex, setCodeIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [showError, setShowError] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const [gameTimer, setGameTimer] = useState(60);
    const [builtChallenges, setBuiltChallenges] = useState<Challenge[]>([]);
    const [userName, setUserName] = useState("Anonymous");

    const currentChallenge = builtChallenges[codeIndex];

    // Save game completion to database
    const saveGameCompletion = useCallback(async (status: 'completed' | 'failed') => {
        try {
            const response = await fetch('/api/game-completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: userName,
                    completionStatus: status,
                    timeTaken: time,
                    totalChallenges: builtChallenges.length,
                    challengesCompleted: codeIndex + (status === 'completed' ? 1 : 0),
                }),
            });

            if (response.ok) {
                console.log('✅ Game completion saved to database');
            }
        } catch (error) {
            console.error('❌ Error saving game completion:', error);
        }
    }, [userName, time, builtChallenges.length, codeIndex]);

    // Normal & urgent messages
    const normalMessages = useMemo(() => [
        { sender: "Boss", text: "Are you done with sprint 1?" },
        { sender: "Family", text: "Can you pick up the kids after work?" },
        { sender: "Teammate", text: "Hey, push your latest code please." },
        { sender: "HR", text: "Reminder: Submit your timesheet today." },
        { sender: "Colleague", text: "Coffee break in 5 minutes?" },
    ], []);

    const urgentMessage = useMemo(() => ({
        sender: "Accessibility Officer",
        text: "URGENT: Fix alt attribute in img1 immediately!",
        urgent: true,
    }), []);

    // Builder Functions
    const updateChallenge = (index: number, field: "buggyCode" | "correctAnswer", value: string) => {
        const newChallenges = [...challenges];
        newChallenges[index][field] = value;
        setChallenges(newChallenges);
    };

    const buildGame = () => {
        // Validate all challenges are filled
        const allFilled = challenges.every(c => c.buggyCode.trim() && c.correctAnswer.trim());
        if (!allFilled) {
            alert("⚠️ Please fill in all 5 challenges before building!");
            return;
        }

        // Build the game
        setBuiltChallenges(challenges);
        setGameTimer(builderTimer);
        setMode("game");
        resetGame();
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (running && scene === "office" && time < gameTimer) {
            interval = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        }
        if (time >= gameTimer) {
            setRunning(false);
            saveGameCompletion('failed');
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [running, scene, time, gameTimer, saveGameCompletion]);

    // Pop-up messages every 15 seconds
    useEffect(() => {
        if (!running || scene === "courtroom") return;

        if (time > 0 && time % 15 === 0 && time !== lastMessageTime) {
            setLastMessageTime(time);

            const showUrgent = urgentIgnoreCount > 0 || Math.random() < 0.25;

            if (showUrgent) {
                setMessage(urgentMessage);
            } else {
                const randomMsg =
                    normalMessages[Math.floor(Math.random() * normalMessages.length)];
                setMessage(randomMsg);
            }
        }
    }, [time, running, scene, urgentIgnoreCount, lastMessageTime, normalMessages, urgentMessage]);

    // Handle notification reply
    const handleReply = (reply: string) => {
        if (message?.urgent) {
            if (reply === "respond") {
                setUrgentIgnoreCount(0);
                setMessage(null);
            } else {
                const newCount = urgentIgnoreCount + 1;
                setUrgentIgnoreCount(newCount);

                if (newCount >= 2) {
                    setScene("courtroom");
                    setMessage(null);
                    setRunning(false);
                    saveGameCompletion('failed');
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
        const normalizedAnswer = userAnswer.trim().replace(/\s+/g, ' ');
        const normalizedCorrect = currentChallenge.correctAnswer.trim().replace(/\s+/g, ' ');

        if (normalizedAnswer === normalizedCorrect) {
            setShowError(false);
            setUserAnswer("");

            if (codeIndex < builtChallenges.length - 1) {
                setCodeIndex(codeIndex + 1);
            } else {
                alert("🎉 Congratulations! You've completed all debugging challenges!");
                saveGameCompletion('completed');
                setCodeIndex(0);
            }
        } else {
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

    const backToBuilder = () => {
        resetGame();
        setMode("builder");
    };

    return (
        <div
            className="w-screen h-screen flex flex-col items-center justify-center relative"
            style={{
                backgroundImage:
                    mode === "game" && scene === "courtroom"
                        ? "url('/courtroom.jpg')"
                        : mode === "game" && running
                            ? "url('/workdesk.jpg')"
                            : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: mode === "builder" || !running ? "#f3f4f6" : "transparent",
            }}
        >
            {/* BUILDER MODE */}
            {mode === "builder" && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto">
                    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
                        🛠️ Game Builder
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Create your custom Python debugging game for students
                    </p>

                    {/* User Name Input */}
                    <div className="mb-8 bg-green-50 p-4 rounded-xl">
                        <label className="block font-semibold text-gray-700 mb-2">
                            Player Name
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full border-2 border-green-300 rounded-lg px-4 py-2 text-lg"
                        />
                    </div>

                    {/* Timer Setting */}
                    <div className="mb-8 bg-blue-50 p-4 rounded-xl">
                        <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <TimerIcon />
                            Set Game Timer (seconds)
                        </label>
                        <input
                            type="number"
                            value={builderTimer}
                            onChange={(e) => setBuilderTimer(Number(e.target.value))}
                            className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 text-lg font-mono"
                            min="30"
                        />
                    </div>

                    {/* 5 Challenges */}
                    <div className="space-y-6">
                        {challenges.map((challenge, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                                <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                                    <CodeIcon />
                                    Challenge {index + 1}
                                </h3>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Buggy Code:
                                </label>
                                <textarea
                                    value={challenge.buggyCode}
                                    onChange={(e) => updateChallenge(index, "buggyCode", e.target.value)}
                                    placeholder="Enter the buggy Python code..."
                                    className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg font-mono text-sm mb-4 resize-none"
                                />

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correct Answer:
                                </label>
                                <textarea
                                    value={challenge.correctAnswer}
                                    onChange={(e) => updateChallenge(index, "correctAnswer", e.target.value)}
                                    placeholder="Enter the correct Python code..."
                                    className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg font-mono text-sm resize-none"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Build Button */}
                    <button
                        onClick={buildGame}
                        className="w-full mt-8 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-3"
                    >
                        <RocketIcon />
                        Build Game
                    </button>
                </div>
            )}

            {/* GAME MODE */}
            {mode === "game" && (
                <>
                    {scene === "office" && (
                        <>
                            {/* Timer Setup Screen */}
                            {!running && (
                                <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center w-[500px]">
                                    <h1 className="text-4xl font-bold mb-6 text-gray-800">
                                        Courtroom Debugging Game
                                    </h1>

                                    <p className="text-xl mb-6 text-gray-700">
                                        Timer: <span className="font-mono font-bold">{gameTimer}s</span>
                                    </p>

                                    <button
                                        onClick={() => setRunning(true)}
                                        className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition mb-4 flex items-center justify-center gap-2 w-full"
                                    >
                                        <PlayIcon />
                                        Start Game
                                    </button>

                                    <button
                                        onClick={backToBuilder}
                                        className="w-full px-6 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
                                    >
                                        <BackArrowIcon />
                                        Back to Builder
                                    </button>
                                </div>
                            )}

                            {/* Game Screen */}
                            {running && (
                                <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center w-[600px] max-h-[90vh] overflow-y-auto">
                                    <h1 className="text-3xl font-bold mb-3 text-gray-800">
                                        Courtroom Debugging Game
                                    </h1>

                                    <p className="mb-4 text-xl text-gray-700">
                                        Time: <span className="font-mono font-bold">{time}s</span> /{" "}
                                        {gameTimer}s
                                    </p>

                                    <button
                                        onClick={() => setRunning(false)}
                                        className="px-6 py-2 bg-red-600 text-white text-lg rounded-xl hover:bg-red-700 transition mb-6 flex items-center gap-2"
                                    >
                                        <PauseIcon />
                                        Pause Timer
                                    </button>

                                    {/* Debugging Challenge */}
                                    <div className="mt-6 text-left bg-gray-100 p-6 rounded-xl shadow-inner">
                                        <div className="flex justify-between items-center mb-3">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                🐍 Python Challenge {codeIndex + 1}/{builtChallenges.length}
                                            </h2>
                                        </div>

                                        {/* Code Display */}
                                        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm mb-4 whitespace-pre-wrap">
                                            {currentChallenge?.buggyCode}
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
                                                <CloseIcon />
                                                <span className="font-semibold">
                                                    Incorrect! Try again.
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
                                className="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition mb-3"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={backToBuilder}
                                className="w-full px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
                            >
                                <BackArrowIcon />
                                Back to Builder
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
                                            className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                                        >
                                            <AlertIcon />
                                            URGENT
                                        </motion.span>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-4 text-base">{message.text}</p>
                                {message.urgent ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReply("respond")}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            <CheckIcon />
                                            Respond
                                        </button>
                                        <button
                                            onClick={() => handleReply("ignore")}
                                            className="flex-1 px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition flex items-center justify-center gap-2"
                                        >
                                            <CloseIcon />
                                            Ignore
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setMessage(null)}
                                        className="w-full px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
                                    >
                                        <CloseIcon />
                                        Close
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
