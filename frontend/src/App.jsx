import { useState, useEffect } from "react";
import API from "./api";

function App() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState(null);

  // fetch issues
  const fetchIssues = async () => {
    const res = await API.get("/issues");
    setIssues(res.data);
  };
  // delete issue
  const deleteIssue = async (id) => {
    await API.delete(`/issues/${id}`);
    fetchIssues();
  };

  const styles = {
    page: {
      background: "#000000",
      minHeight: "100vh",
      padding: "1px 0 60px",
    },
    container: {
      maxWidth: "700px",
      margin: "40px auto",
      fontFamily: "Montserrat, sans-serif",
      padding: "0 20px",
    },
    title: {
      textAlign: "center",
      marginBottom: "50px",
      color: "#ffffff",
    },
    card: {
      background: "#1a1f27",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "1px solid #30363d",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    },
    aiCard: {
      background: "#161b22",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "1px solid #1f3a6b",
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "6px",
      border: "1px solid #30363d",
      background: "#0d1117",
      color: "#c9d1d9",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "14px",
      boxSizing: "border-box",
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      minHeight: "80px",
      borderRadius: "6px",
      border: "1px solid #30363d",
      background: "#0d1117",
      color: "#c9d1d9",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "14px",
      marginBottom: "10px",
      boxSizing: "border-box",
      resize: "vertical",
      outline: "none",
    },
    buttonRow: {
      display: "flex",
      gap: "10px",
    },
    primaryBtn: {
      flex: 1,
      padding: "10px",
      background: "#238636",
      color: "white",
      border: "1px solid #2ea043",
      borderRadius: "6px",
      cursor: "pointer",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "600",
    },
    secondaryBtn: {
      flex: 1,
      padding: "10px",
      background: "#1f2d5a",
      color: "#b6dafa",
      border: "1px solid #234b82",
      borderRadius: "6px",
      cursor: "pointer",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: "600",
    },
    deleteBtn: {
      padding: "5px 10px",
      background: "#d73a49",
      color: "white",
      border: "1px solid #e55361",
      borderRadius: "6px",
      cursor: "pointer",
    },
    pre: {
      background: "#0d1117",
      padding: "10px",
      borderRadius: "6px",
      overflowX: "auto",
      color: "#79c0ff",
      border: "1px solid #30363d",
    },
    issueItem: {
      padding: "10px",
      borderBottom: "1px solid #21262d",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    issueTitle: {
      color: "#f0f6fc",
      fontWeight: "600",
    },
    meta: {
      fontSize: "12px",
      color: "#8b949e",
    },
    sectionHeading: {
      color: "#f0f6fc",
      marginTop: 0,
    },
    aiHeading: {
      color: "#79c0ff",
      marginTop: 0,
    },
    emptyText: {
      color: "#8b949e",
    },
  };
 
 

  useEffect(() => {
    fetchIssues();
  }, []);

  // create issue
  const createIssue = async () => {
    if (!title) return;

    await API.post("/issues", {
      title,
      description,
      status: "open",
      severity: "low",
    });

    setTitle("");
    setDescription("");
    fetchIssues();
  };

  // AI enhance
  const enhanceAI = async () => {
    if (!title) return;

    const res = await API.post("/issues/ai-enhance", {
      title,
      description,
    });

    setAiResult(res.data);
  };

  return (
  <div style={styles.container}>
    <h1 style={styles.title}>AI Bug Tracker</h1>

    <div style={styles.card}>
      <input
        style={styles.input}
        placeholder="Issue Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        style={styles.textarea}
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div style={styles.buttonRow}>
        <button style={styles.primaryBtn} onClick={createIssue}>
          Create Issue
        </button>

        <button style={styles.secondaryBtn} onClick={enhanceAI}>
          AI Enhance
        </button>
      </div>
    </div>

    {aiResult && (
      <div style={styles.card}>
        <h3>AI Output</h3>
        <pre style={styles.pre}>
          {JSON.stringify(aiResult, null, 2)}
        </pre>
      </div>
    )}

    <div style={styles.card}>
      <h2>Issues</h2>

      {issues.length === 0 && <p>No issues yet</p>}

      {issues.map((i) => (
        <div key={i.id} style={styles.issueItem}>
          <div>
            <div>
              <strong>{i.title}</strong>
            </div>
            <div style={styles.meta}>
              {i.status} • {i.severity}
            </div>
          </div>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteIssue(i.id)}
            >
              Delete
            </button>
        </div>
      ))}
    </div>
  </div>
);


}

export default App;