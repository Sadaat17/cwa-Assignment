"use client";

import { useState, useEffect, useMemo } from "react";

// Component for live HTML preview
//Chatgpt Generated:
function LiveHTMLPreview({
    mainTitle,
    tabs,
    activeTab,
    tabContent
}: {
    mainTitle: string;
    tabs: string[];
    activeTab: number;
    tabContent: { [key: number]: string };
}) {
    const generateHTML = useMemo(() => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mainTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .tab-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 16px;
        }
        .tab-button {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #aaa;
            background-color: #e5e5e5;
            color: #000;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tab-button.active {
            background-color: #3b82f6;
            color: #fff;
        }
        .tab-button:hover {
            background-color: #d1d5db;
        }
        .tab-button.active:hover {
            background-color: #2563eb;
        }
        .add-tab {
            padding: 6px 12px;
            border-radius: 4px;
            background-color: #8b5cf6;
            color: #fff;
            border: 1px solid #7c3aed;
            cursor: pointer;
        }
        .remove-tab {
            padding: 6px 12px;
            border-radius: 4px;
            background-color: #ef4444;
            color: #fff;
            border: 1px solid #dc2626;
            cursor: pointer;
        }
        .tab-content {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            background-color: #f9f9f9;
            min-height: 200px;
        }
        .text-area {
            width: 100%;
            min-height: 180px;
            padding: 12px;
            border: 1px solid #aaa;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        }
        .text-area:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${mainTitle}</h1>
        
        <!-- Tab Buttons -->
        <div class="tab-buttons" id="tabButtons">
            ${tabs.map((tab: string, idx: number) => `
                <button class="tab-button ${idx === activeTab ? 'active' : ''}" onclick="setActiveTab(${idx})">
                    ${tab}
                </button>
            `).join('')}
            
            <button class="add-tab" onclick="addTab()">+</button>
            <button class="remove-tab" onclick="removeTab()">-</button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
            <textarea 
                id="contentTextarea" 
                class="text-area" 
                placeholder="Enter your content here..."
                onchange="handleContentChange(${activeTab}, this.value)"
            >${tabContent[activeTab] || ''}</textarea>
        </div>
    </div>

    <script>
        // Initialize data
        let tabs = ${JSON.stringify(tabs)};
        let activeTab = ${activeTab};
        let tabContent = ${JSON.stringify(tabContent)};

        // Load from localStorage
        function loadData() {
            const saved = localStorage.getItem("tabContent");
            if (saved) {
                tabContent = JSON.parse(saved);
                updateContent();
            }
        }

        // Set active tab
        function setActiveTab(index) {
            activeTab = index;
            updateTabButtons();
            updateContent();
        }

        // Update tab buttons
        function updateTabButtons() {
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === activeTab);
            });
        }

        // Update content
        function updateContent() {
            const textarea = document.getElementById('contentTextarea');
            if (textarea) {
                textarea.value = tabContent[activeTab] || '';
            }
        }

        // Handle content changes
        function handleContentChange(tabIndex, value) {
            tabContent[tabIndex] = value;
            // Save to localStorage
            localStorage.setItem("tabContent", JSON.stringify(tabContent));
        }

        // Add tab
        function addTab() {
            if (tabs.length < 15) {
                const newIndex = tabs.length;
                tabs.push(\`Tab \${newIndex + 1}\`);
                tabContent[newIndex] = '';
                updateTabButtons();
                addTabButton(newIndex);
            }
        }

        // Add tab button
        function addTabButton(index) {
            const tabButtons = document.getElementById('tabButtons');
            const newButton = document.createElement('button');
            newButton.className = 'tab-button';
            newButton.onclick = () => setActiveTab(index);
            newButton.textContent = tabs[index];
            
            // Insert before the add button
            const addButton = tabButtons.querySelector('.add-tab');
            tabButtons.insertBefore(newButton, addButton);
        }

        // Remove tab
        function removeTab() {
            if (tabs.length > 1) {
                const removedIndex = tabs.length - 1;
                tabs.pop();
                delete tabContent[removedIndex];
                
                if (activeTab >= tabs.length) {
                    activeTab = tabs.length - 1;
                }
                
                updateTabButtons();
                updateContent();
                
                // Remove the button
                const buttons = document.querySelectorAll('.tab-button');
                if (buttons[removedIndex]) {
                    buttons[removedIndex].remove();
                }
            }
        }

        // Initialize
        loadData();
        updateTabButtons();
        updateContent();
    </script>
</body>
</html>`;
    }, [mainTitle, tabs, activeTab, tabContent]);

    return (
        <div>
            <h3 style={{ marginBottom: "8px" }}>Live HTML Preview (Updates in Real-time):</h3>
            <pre style={{ padding: "16px", backgroundColor: "#f3f3f3", border: "1px solid #ccc", borderRadius: "8px", overflowX: "auto", whiteSpace: "pre-wrap", fontSize: "12px", maxHeight: "400px" }}>
                {generateHTML}
            </pre>
        </div>
    );
}

export default function TabsDemo() {
    const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"]);
    const [activeTab, setActiveTab] = useState(0);
    const [mainTitle, setMainTitle] = useState("Tabbed Notes");
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingTab, setEditingTab] = useState<number | null>(null);
    const [showLivePreview, setShowLivePreview] = useState(false);
    const [tabContent, setTabContent] = useState<{ [key: number]: string }>({});

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("tabContent");
        if (saved) {
            setTabContent(JSON.parse(saved));
        } else {
            const init: { [key: number]: string } = {};
            tabs.forEach((_, i) => (init[i] = ""));
            setTabContent(init);
        }
    }, []);

    const addTab = () => {
        if (tabs.length < 15) {
            const newIndex = tabs.length;
            setTabs([...tabs, `Tab ${newIndex + 1}`]);
            setTabContent({ ...tabContent, [newIndex]: "" });
        }
    };

    const removeTab = () => {
        if (tabs.length > 1) {
            const newTabs = [...tabs];
            const removedIndex = newTabs.length - 1;
            newTabs.pop();
            setTabs(newTabs);

            const newTabContent = { ...tabContent };
            delete newTabContent[removedIndex];
            setTabContent(newTabContent);

            if (activeTab >= newTabs.length) {
                setActiveTab(newTabs.length - 1);
            }
        }
    };

    const handleContentChange = (tabIndex: number, value: string) => {
        setTabContent({
            ...tabContent,
            [tabIndex]: value,
        });
        // Save to localStorage
        localStorage.setItem("tabContent", JSON.stringify({
            ...tabContent,
            [tabIndex]: value,
        }));
    };

    const handleTitleEdit = () => {
        setEditingTitle(true);
    };

    const handleTitleSave = (newTitle: string) => {
        if (newTitle.trim()) {
            setMainTitle(newTitle.trim());
        }
        setEditingTitle(false);
    };

    const handleTabEdit = (tabIndex: number) => {
        setEditingTab(tabIndex);
    };

    const handleTabSave = (tabIndex: number, newName: string) => {
        if (newName.trim()) {
            const newTabs = [...tabs];
            newTabs[tabIndex] = newName.trim();
            setTabs(newTabs);
        }
        setEditingTab(null);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Complete HTML copied to clipboard! You can now paste it into a .html file.");
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert("Failed to copy to clipboard. Please select and copy the HTML manually.");
        }
    };

    // Generate the current HTML for copying
    const currentHTML = useMemo(() => {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mainTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .tab-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 16px;
        }
        .tab-button {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #aaa;
            background-color: #e5e5e5;
            color: #000;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tab-button.active {
            background-color: #3b82f6;
            color: #fff;
        }
        .tab-button:hover {
            background-color: #d1d5db;
        }
        .tab-button.active:hover {
            background-color: #2563eb;
        }
        .add-tab {
            padding: 6px 12px;
            border-radius: 4px;
            background-color: #8b5cf6;
            color: #fff;
            border: 1px solid #7c3aed;
            cursor: pointer;
        }
        .remove-tab {
            padding: 6px 12px;
            border-radius: 4px;
            background-color: #ef4444;
            color: #fff;
            border: 1px solid #dc2626;
            cursor: pointer;
        }
        .tab-content {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            background-color: #f9f9f9;
            min-height: 200px;
        }
        .text-area {
            width: 100%;
            min-height: 180px;
            padding: 12px;
            border: 1px solid #aaa;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        }
        .text-area:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${mainTitle}</h1>
        
        <!-- Tab Buttons -->
        <div class="tab-buttons" id="tabButtons">
            ${tabs.map((tab: string, idx: number) => `
                <button class="tab-button ${idx === activeTab ? 'active' : ''}" onclick="setActiveTab(${idx})">
                    ${tab}
                </button>
            `).join('')}
            
            <button class="add-tab" onclick="addTab()">+</button>
            <button class="remove-tab" onclick="removeTab()">-</button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
            <textarea 
                id="contentTextarea" 
                class="text-area" 
                placeholder="Enter your content here..."
                onchange="handleContentChange(${activeTab}, this.value)"
            >${tabContent[activeTab] || ''}</textarea>
        </div>
    </div>

    <script>
        // Initialize data
        let tabs = ${JSON.stringify(tabs)};
        let activeTab = ${activeTab};
        let tabContent = ${JSON.stringify(tabContent)};

        // Load from localStorage
        function loadData() {
            const saved = localStorage.getItem("tabContent");
            if (saved) {
                tabContent = JSON.parse(saved);
                updateContent();
            }
        }

        // Set active tab
        function setActiveTab(index) {
            activeTab = index;
            updateTabButtons();
            updateContent();
        }

        // Update tab buttons
        function updateTabButtons() {
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === activeTab);
            });
        }

        // Update content
        function updateContent() {
            const textarea = document.getElementById('contentTextarea');
            if (textarea) {
                textarea.value = tabContent[activeTab] || '';
            }
        }

        // Handle content changes
        function handleContentChange(tabIndex, value) {
            tabContent[tabIndex] = value;
            // Save to localStorage
            localStorage.setItem("tabContent", JSON.stringify(tabContent));
        }

        // Add tab
        function addTab() {
            if (tabs.length < 15) {
                const newIndex = tabs.length;
                tabs.push(\`Tab \${newIndex + 1}\`);
                tabContent[newIndex] = '';
                updateTabButtons();
                addTabButton(newIndex);
            }
        }

        // Add tab button
        function addTabButton(index) {
            const tabButtons = document.getElementById('tabButtons');
            const newButton = document.createElement('button');
            newButton.className = 'tab-button';
            newButton.onclick = () => setActiveTab(index);
            newButton.textContent = tabs[index];
            
            // Insert before the add button
            const addButton = tabButtons.querySelector('.add-tab');
            tabButtons.insertBefore(newButton, addButton);
        }

        // Remove tab
        function removeTab() {
            if (tabs.length > 1) {
                const removedIndex = tabs.length - 1;
                tabs.pop();
                delete tabContent[removedIndex];
                
                if (activeTab >= tabs.length) {
                    activeTab = tabs.length - 1;
                }
                
                updateTabButtons();
                updateContent();
                
                // Remove the button
                const buttons = document.querySelectorAll('.tab-button');
                if (buttons[removedIndex]) {
                    buttons[removedIndex].remove();
                }
            }
        }

        // Initialize
        loadData();
        updateTabButtons();
        updateContent();
    </script>
</body>
</html>`;
    }, [mainTitle, tabs, activeTab, tabContent]);

    return (
        <div style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Title - Editable */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
                {editingTitle ? (
                    <input
                        type="text"
                        value={mainTitle}
                        onChange={(e) => setMainTitle(e.target.value)}
                        onBlur={() => handleTitleSave(mainTitle)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTitleSave(mainTitle)}
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            textAlign: "center",
                            border: "2px solid #3b82f6",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            width: "300px"
                        }}
                        autoFocus
                    />
                ) : (
                    <h1
                        onClick={handleTitleEdit}
                        style={{
                            cursor: "pointer",
                            margin: 0,
                            padding: "8px",
                            borderRadius: "4px",
                            transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        title="Click to edit title"
                    >
                        {mainTitle}
                    </h1>
                )}
            </div>

            {/* Tab Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {tabs.map((tab, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                        {editingTab === idx ? (
                            <input
                                type="text"
                                value={tab}
                                onChange={(e) => {
                                    const newTabs = [...tabs];
                                    newTabs[idx] = e.target.value;
                                    setTabs(newTabs);
                                }}
                                onBlur={() => handleTabSave(idx, tab)}
                                onKeyPress={(e) => e.key === 'Enter' && handleTabSave(idx, tab)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    border: "2px solid #3b82f6",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    width: "80px",
                                    fontSize: "12px"
                                }}
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={() => setActiveTab(idx)}
                                onDoubleClick={() => handleTabEdit(idx)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    border: "1px solid #aaa",
                                    backgroundColor: activeTab === idx ? "#3b82f6" : "#e5e5e5",
                                    color: activeTab === idx ? "#fff" : "#000",
                                    cursor: "pointer",
                                    position: "relative"
                                }}
                                title="Double-click to edit tab name"
                            >
                                {tab}
                            </button>
                        )}
                    </div>
                ))}

                {/* Add Tab */}
                <button onClick={addTab} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#8b5cf6", color: "#fff", border: "1px solid #7c3aed", cursor: "pointer" }}>+</button>

                {/* Remove Tab */}
                <button onClick={removeTab} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#ef4444", color: "#fff", border: "1px solid #dc2626", cursor: "pointer" }}>-</button>

                {/* Toggle Live Preview */}
                <button
                    onClick={() => setShowLivePreview(!showLivePreview)}
                    style={{
                        marginLeft: "auto",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        backgroundColor: showLivePreview ? "#f59e0b" : "#06b6d4",
                        color: "#fff",
                        border: "1px solid #d97706",
                        cursor: "pointer"
                    }}
                >
                    {showLivePreview ? "Hide Live Preview" : "Show Live Preview"}
                </button>

                {/* Generate HTML */}
                <button
                    onClick={() => copyToClipboard(currentHTML)}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#10b981",
                        color: "#fff",
                        border: "1px solid #059669",
                        cursor: "pointer"
                    }}
                >
                    Generate HTML
                </button>
            </div>

            {/* Tab Content - Single Text Box */}
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", backgroundColor: "#f9f9f9", minHeight: "200px" }}>
                <textarea
                    value={tabContent[activeTab] || ""}
                    onChange={(e) => handleContentChange(activeTab, e.target.value)}
                    placeholder="Enter your content here..."
                    style={{
                        width: "100%",
                        minHeight: "180px",
                        padding: "12px",
                        border: "1px solid #aaa",
                        borderRadius: "4px",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        resize: "vertical",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            {/* Live HTML Preview */}
            {showLivePreview && (
                <LiveHTMLPreview
                    mainTitle={mainTitle}
                    tabs={tabs}
                    activeTab={activeTab}
                    tabContent={tabContent}
                />
            )}

            {/* Info Box */}
            {!showLivePreview && (
                <div style={{
                    padding: "12px",
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #0ea5e9",
                    borderRadius: "8px",
                    textAlign: "center"
                }}>
                    <p style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
                        💡 <strong>Tip:</strong> Use "Generate HTML" to get the complete standalone HTML file!
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#0c4a6e" }}>
                        The HTML includes all your tabs, custom names, and text content. You can copy it and save as a .html file to use in any browser.
                    </p>
                </div>
            )}
        </div>
    );
}
