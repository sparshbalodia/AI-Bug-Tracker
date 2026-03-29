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

  const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Montserrat, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    minHeight: "80px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  primaryBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: "10px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pre: {
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "6px",
    overflowX: "auto",
  },
  issueItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  meta: {
    fontSize: "12px",
    color: "#666",
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
    <h1 style={styles.title}>🐞 AI Bug Tracker</h1>

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
        <h3>🤖 AI Output</h3>
        <pre style={styles.pre}>
          {JSON.stringify(aiResult, null, 2)}
        </pre>
      </div>
    )}

    <div style={styles.card}>
      <h2>📋 Issues</h2>

      {issues.length === 0 && <p>No issues yet</p>}

      {issues.map((i) => (
        <div key={i.id} style={styles.issueItem}>
          <div>
            <strong>{i.title}</strong>
          </div>
          <div style={styles.meta}>
            {i.status} • {i.severity}
          </div>
        </div>
      ))}
    </div>
  </div>
);


}

export default App;