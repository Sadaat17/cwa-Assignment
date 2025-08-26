"use client";

import { useState, useEffect } from "react";

export default function TabsDemo() {
    const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"]);
    const [activeTab, setActiveTab] = useState(0);
    const [showHTML, setShowHTML] = useState(false);
    const [error, setError] = useState("");
    const [htmlContent, setHtmlContent] = useState("");

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

    const handleShowHTML = () => {
        const data = formData[activeTab] || { ...initialFormData };
        setFormData(prev => ({ ...prev, [activeTab]: data }));

        const html = `
<div style="border:1px solid #ccc;border-radius:8px;padding:16px;background-color:#f9f9f9">
    <form>
        <div style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px">Name:</label>
            <input type="text" style="border:1px solid #aaa;padding:6px;width:100%" value="${data.name}">
        </div>
        <div style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px">Student ID*:</label>
            <input type="text" style="border:1px solid #aaa;padding:6px;width:100%" value="${data.studentID}">
        </div>
        <div style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px">Age*:</label>
            <input type="range" min="18" max="40" style="width:100%" value="${data.age}">
            <span style="margin-left:8px">${data.age}</span>
        </div>
        <div style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px">Date:</label>
            <input type="date" style="border:1px solid #aaa;padding:6px" value="${data.date}">
        </div>
        <div style="margin-bottom:8px">
            <label style="display:block;margin-bottom:4px">Subjects:</label>
            <label style="margin-right:12px">
                <input type="checkbox" ${data.subject.includes("cse3cwa") ? "checked" : ""}> cse3cwa
            </label>
            <label style="margin-right:12px">
                <input type="checkbox" ${data.subject.includes("cse3CI") ? "checked" : ""}> cse3CI
            </label>
            <label style="margin-right:12px">
                <input type="checkbox" ${data.subject.includes("cse3VIS") ? "checked" : ""}> cse3VIS
            </label>
        </div>
    </form>
</div>
`.trim();

        setHtmlContent(html);
        setShowHTML(prev => !prev); // toggle visibility
    };

    const handleSave = () => {
        localStorage.setItem("tabForms", JSON.stringify(formData));
        alert("Form data saved!");
    };

    return (
        <div style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Tab Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            border: "1px solid #aaa",
                            backgroundColor: activeTab === idx ? "#3b82f6" : "#e5e5e5",
                            color: activeTab === idx ? "#fff" : "#000",
                            cursor: "pointer",
                        }}
                    >
                        {tab}
                    </button>
                ))}

                {/* Add Tab */}
                <button onClick={addTab} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#8b5cf6", color: "#fff", border: "1px solid #7c3aed", cursor: "pointer" }}>+</button>

                {/* Remove Tab */}
                <button onClick={removeTab} style={{ padding: "6px 12px", borderRadius: "4px", backgroundColor: "#ef4444", color: "#fff", border: "1px solid #dc2626", cursor: "pointer" }}>-</button>

                {/* Show HTML */}
                <button onClick={handleShowHTML} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "4px", backgroundColor: "#10b981", color: "#fff", border: "1px solid #059669", cursor: "pointer" }}>
                    {showHTML ? "Hide HTML" : "Show HTML"}
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

            {showHTML && (
                <pre style={{ padding: "16px", backgroundColor: "#f3f3f3", border: "1px solid #ccc", borderRadius: "8px", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                    {htmlContent}
                </pre>
            )}
        </div>
    );
}
