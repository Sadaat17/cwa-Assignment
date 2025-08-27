"use client";

import { useState, useEffect } from "react";

export default function TabsDemo() {
    const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"]);
    const [activeTab, setActiveTab] = useState(0);
    const [error, setError] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [mainTitle, setMainTitle] = useState("Tabbed Forms");
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingTab, setEditingTab] = useState<number | null>(null);

    const initialFormData = { name: "", studentID: "", age: "", date: "", subject: [] as string[] };
    const [formData, setFormData] = useState<{ [key: number]: typeof initialFormData }>({});

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("tabForms");
        if (saved) {
            setFormData(JSON.parse(saved));
        } else {
            const init: { [key: number]: typeof initialFormData } = {};
            tabs.forEach((_, i) => (init[i] = { ...initialFormData }));
            setFormData(init);
        }
    }, []);

    const addTab = () => {
        if (tabs.length < 15) {
            const newIndex = tabs.length;
            setTabs([...tabs, `Tab ${newIndex + 1}`]);
            setFormData({ ...formData, [newIndex]: { ...initialFormData } });
        }
    };

    const removeTab = () => {
        if (tabs.length > 1) {
            const newTabs = [...tabs];
            const removedIndex = newTabs.length - 1;
            newTabs.pop();
            setTabs(newTabs);

            const newFormData = { ...formData };
            delete newFormData[removedIndex];
            setFormData(newFormData);

            if (activeTab >= newTabs.length) {
                setActiveTab(newTabs.length - 1);
            }
        }
    };

    const handleChange = (tabIndex: number, field: string, value: any) => {
        setFormData({
            ...formData,
            [tabIndex]: { ...formData[tabIndex], [field]: value },
        });
    };

    const toggleSubject = (tabIndex: number, subject: string) => {
        const current = formData[tabIndex].subject || [];
        if (current.includes(subject)) {
            handleChange(tabIndex, "subject", current.filter((s) => s !== subject));
        } else {
            handleChange(tabIndex, "subject", [...current, subject]);
        }
    };

    const validateForm = (data: typeof initialFormData) => {
        return !!data.studentID && !!data.age;
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

    const generateCompleteHTML = () => {
        const data = formData[activeTab] || { ...initialFormData };
        setFormData(prev => ({ ...prev, [activeTab]: data }));

        // Generate the complete standalone HTML with only tabs and form
        const completeHTML = `<!DOCTYPE html>
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
        .tab-form {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            background-color: #f9f9f9;
        }
        .form-group {
            margin-bottom: 8px;
        }
        .form-group label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
        }
        .form-group input[type="text"],
        .form-group input[type="date"] {
            border: 1px solid #aaa;
            padding: 6px;
            width: 100%;
            border-radius: 4px;
        }
        .form-group input[type="range"] {
            width: 100%;
        }
        .checkbox-group {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: normal;
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

        <!-- Tab Form -->
        <div class="tab-form">
            <form id="tabForm">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" id="nameInput" value="${formData[activeTab]?.name || ''}" onchange="handleChange(${activeTab}, 'name', this.value)">
                </div>

                <div class="form-group">
                    <label>Student ID*:</label>
                    <input type="text" id="studentIDInput" value="${formData[activeTab]?.studentID || ''}" onchange="handleChange(${activeTab}, 'studentID', this.value)">
                </div>

                <div class="form-group">
                    <label>Age*:</label>
                    <input type="range" min="18" max="40" id="ageInput" value="${formData[activeTab]?.age || ''}" onchange="handleChange(${activeTab}, 'age', this.value)">
                    <span id="ageDisplay" style="margin-left: 8px;">${formData[activeTab]?.age || ''}</span>
                </div>

                <div class="form-group">
                    <label>Date:</label>
                    <input type="date" id="dateInput" value="${formData[activeTab]?.date || ''}" onchange="handleChange(${activeTab}, 'date', this.value)">
                </div>

                <div class="form-group">
                    <label>Subjects:</label>
                    <div class="checkbox-group">
                        ${["cse3cwa", "cse3CI", "cse3VIS"].map((sub: string) => `
                            <label>
                                <input type="checkbox" ${formData[activeTab]?.subject?.includes(sub) ? 'checked' : ''} onchange="toggleSubject(${activeTab}, '${sub}')"> ${sub}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Initialize data
        let tabs = ${JSON.stringify(tabs)};
        let activeTab = ${activeTab};
        let formData = ${JSON.stringify(formData)};

        const initialFormData = { name: "", studentID: "", age: "", date: "", subject: [] };

        // Load from localStorage
        function loadData() {
            const saved = localStorage.getItem("tabForms");
            if (saved) {
                formData = JSON.parse(saved);
                updateForm();
            }
        }

        // Set active tab
        function setActiveTab(index) {
            activeTab = index;
            updateTabButtons();
            updateForm();
        }

        // Update tab buttons
        function updateTabButtons() {
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach((btn, idx) => {
                btn.classList.toggle('active', idx === activeTab);
            });
        }

        // Update form
        function updateForm() {
            const data = formData[activeTab] || { ...initialFormData };
            document.getElementById('nameInput').value = data.name || '';
            document.getElementById('studentIDInput').value = data.studentID || '';
            document.getElementById('ageInput').value = data.age || '';
            document.getElementById('ageDisplay').textContent = data.age || '';
            document.getElementById('dateInput').value = data.date || '';
            
            // Update checkboxes
            const subjects = data.subject || [];
            ['cse3cwa', 'cse3CI', 'cse3VIS'].forEach(sub => {
                const checkbox = document.querySelector(\`input[onchange*="'\${sub}'"]\`);
                if (checkbox) checkbox.checked = subjects.includes(sub);
            });
        }

        // Handle form changes
        function handleChange(tabIndex, field, value) {
            if (!formData[tabIndex]) formData[tabIndex] = { ...initialFormData };
            formData[tabIndex][field] = value;
            
            // Update age display
            if (field === 'age') {
                document.getElementById('ageDisplay').textContent = value;
            }
        }

        // Toggle subject
        function toggleSubject(tabIndex, subject) {
            if (!formData[tabIndex]) formData[tabIndex] = { ...initialFormData };
            if (!formData[tabIndex].subject) formData[tabIndex].subject = [];
            
            const current = formData[tabIndex].subject;
            if (current.includes(subject)) {
                formData[tabIndex].subject = current.filter(s => s !== subject);
            } else {
                formData[tabIndex].subject = [...current, subject];
            }
        }

        // Add tab
        function addTab() {
            if (tabs.length < 15) {
                const newIndex = tabs.length;
                tabs.push(\`Tab \${newIndex + 1}\`);
                formData[newIndex] = { ...initialFormData };
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
                delete formData[removedIndex];
                
                if (activeTab >= tabs.length) {
                    activeTab = tabs.length - 1;
                }
                
                updateTabButtons();
                updateForm();
                
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
        updateForm();
    </script>
</body>
</html>`;

        setHtmlContent(completeHTML);
    };

    const handleSave = () => {
        localStorage.setItem("tabForms", JSON.stringify(formData));
        alert("Form data saved!");
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

                {/* Generate Complete HTML */}
                <button onClick={generateCompleteHTML} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "4px", backgroundColor: "#06b6d4", color: "#fff", border: "1px solid #0891b2", cursor: "pointer" }}>
                    Generate Complete HTML
                </button>

                {/* Save */}
                <button onClick={handleSave} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#facc15", color: "#000", border: "1px solid #eab308", cursor: "pointer" }}>Save</button>
            </div>

            {/* Tab Form */}
            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", backgroundColor: "#f9f9f9" }}>
                <form>
                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Name:</label>
                        <input type="text" value={formData[activeTab]?.name || ""} onChange={(e) => handleChange(activeTab, "name", e.target.value)} style={{ border: "1px solid #aaa", padding: "6px", width: "100%" }} />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Student ID*:</label>
                        <input type="text" value={formData[activeTab]?.studentID || ""} onChange={(e) => handleChange(activeTab, "studentID", e.target.value)} style={{ border: "1px solid #aaa", padding: "6px", width: "100%" }} />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Age*:</label>
                        <input type="range" min="18" max="40" value={formData[activeTab]?.age || ""} onChange={(e) => handleChange(activeTab, "age", e.target.value)} style={{ width: "100%" }} />
                        <span style={{ marginLeft: "8px" }}>{formData[activeTab]?.age}</span>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Date:</label>
                        <input type="date" value={formData[activeTab]?.date || ""} onChange={(e) => handleChange(activeTab, "date", e.target.value)} style={{ border: "1px solid #aaa", padding: "6px" }} />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "4px" }}>Subjects:</label>
                        {["cse3cwa", "cse3CI", "cse3VIS"].map((sub) => (
                            <label key={sub} style={{ marginRight: "12px" }}>
                                <input type="checkbox" checked={formData[activeTab]?.subject?.includes(sub) || false} onChange={() => toggleSubject(activeTab, sub)} /> {sub}
                            </label>
                        ))}
                    </div>
                </form>
            </div>

            {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}

            {/* HTML Display Area */}
            {htmlContent && (
                <div>
                    <h3 style={{ marginBottom: "8px" }}>Generated Complete HTML:</h3>
                    <pre style={{ padding: "16px", backgroundColor: "#f3f3f3", border: "1px solid #ccc", borderRadius: "8px", overflowX: "auto", whiteSpace: "pre-wrap", fontSize: "12px", maxHeight: "400px" }}>
                        {htmlContent}
                    </pre>
                    <button
                        onClick={() => copyToClipboard(htmlContent)}
                        style={{
                            marginTop: "8px",
                            padding: "8px 16px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Copy HTML
                    </button>
                </div>
            )}
        </div>
    );
}
