"use client";

import { useState, useRef, useEffect } from "react";

export default function TabsDemo() {
    const [tabs, setTabs] = useState([
        { title: "Tab 1", content: "" },
        { title: "Tab 2", content: "" },
        { title: "Tab 3", content: "" },
        { title: "Tab 4", content: "" },
        { title: "Tab 5", content: "" },
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const [showHTML, setShowHTML] = useState(false);
    const [error, setError] = useState("");
    const [htmlOutput, setHtmlOutput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Load saved content from localStorage
    useEffect(() => {
        const savedTabs = localStorage.getItem("tabsData");
        if (savedTabs) {
            setTabs(JSON.parse(savedTabs));
        }
    }, []);

    // Save to localStorage whenever tabs change
    const saveTabs = (updatedTabs: typeof tabs) => {
        setTabs(updatedTabs);
        localStorage.setItem("tabsData", JSON.stringify(updatedTabs));
    };

    const addTab = () => {
        if (tabs.length < 15) {
            const newIndex = tabs.length + 1;
            const newTabs = [...tabs, { title: `Tab ${newIndex}`, content: "" }];
            saveTabs(newTabs);
        }
    };

    // Handle Enter key press → store text
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const newTabs = [...tabs];
            newTabs[activeTab].content = inputRef.current?.value || "";
            saveTabs(newTabs);
            if (inputRef.current) inputRef.current.value = ""; // clear input
        }
    };

    // Generate HTML only when button clicked
    const handleOutputClick = () => {
        const currentTab = tabs[activeTab];
        if (!currentTab.content.trim()) {
            setError("⚠️ Please add text to this tab before viewing the HTML.");
            setShowHTML(false);
            return;
        }
        setError("");
        const html = `
<div class="tab">
  <h2>${currentTab.title}</h2>
  <p>${currentTab.content}</p>
</div>
    `.trim();
        setHtmlOutput(html);
        setShowHTML(true);
    };

    return (
        <div className="p-4 border rounded-md space-y-4">
            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-4 py-2 rounded ${activeTab === idx ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        {tab.title}
                    </button>
                ))}

                {/* Add Tab button */}
                <button
                    onClick={addTab}
                    className="px-4 py-2 bg-purple-500 text-white rounded"
                >
                    +
                </button>

                {/* Output button */}
                <button
                    onClick={handleOutputClick}
                    className="ml-auto px-4 py-2 bg-green-500 text-white rounded"
                >
                    Show HTML
                </button>
            </div>

            {/* Tab Content Input */}
            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">{tabs[activeTab].title} Content</h2>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter text and press Enter..."
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border rounded"
                />
                <p className="mt-2 text-gray-700">
                    Saved text:{" "}
                    <span className="font-semibold">{tabs[activeTab].content || "None"}</span>
                </p>
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            {/* Show generated HTML */}
            {showHTML && !error && (
                <div>
                    <pre className="p-4 bg-gray-100 border rounded overflow-x-auto">
                        {htmlOutput}
                    </pre>
                    <button
                        onClick={() => navigator.clipboard.writeText(htmlOutput || "")}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Copy HTML
                    </button>
                </div>
            )}
        </div>
    );
}

