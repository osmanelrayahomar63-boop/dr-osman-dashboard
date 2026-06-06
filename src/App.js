import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setResponse(data.response || data.error || "No response");
    } catch (err) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      color: "#fff",
      fontFamily: "Georgia, serif",
      padding: "2rem"
    }}>
      <h1 style={{ color: "#f5a623", fontSize: "1.8rem" }}>
        Dr. Osman Elrayah Omar Hassabalah
      </h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        Internal Medicine · Telehealth · Medical Advisory · Wellness · Aesthetic
      </p>

      <hr style={{ borderColor: "#333", marginBottom: "2rem" }} />

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter your medical query..."
        rows={4}
        style={{
          width: "100%",
          backgroundColor: "#1a1a2e",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "1rem",
          fontSize: "1rem",
          resize: "vertical",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={run}
        disabled={loading}
        style={{
          marginTop: "1rem",
          backgroundColor: "#f5a623",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          padding: "0.8rem 2rem",
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "⏳ Loading..." : "▶ Run"}
      </button>

      {response && (
        <div style={{
          marginTop: "2rem",
          backgroundColor: "#1a1a2e",
          border: "1px solid #f5a623",
          borderRadius: "8px",
          padding: "1.5rem"
        }}>
          <h3 style={{ color: "#f5a623", marginTop: 0 }}>AI Response:</h3>
          <p style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
            {response}
          </p>
        </div>
      )}

      <footer style={{
        marginTop: "3rem",
        color: "#444",
        fontSize: "0.8rem",
        textAlign: "center"
      }}>
        Dr. Osman Elrayah · AI Dashboard · Powered by Gemini
      </footer>
    </div>
  );
  }
