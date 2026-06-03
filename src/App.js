import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an AI assistant to Dr. Osman Elrayah, Internal Medicine Specialist with 25 years experience.",
          messages: [{role: "user", content: input}]
        })
      });
      const data = await res.json();
      setResponse(data.content?.[0]?.text || "No response");
    } catch(e) {
      setResponse("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{background:"#0a0e1a",minHeight:"100vh",color:"#e8e0d0",padding:20,fontFamily:"sans-serif"}}>
      <div style={{borderBottom:"1px solid #D4A01744",paddingBottom:16,marginBottom:20}}>
        <h2 style={{color:"#D4A017",margin:0}}>Dr. Osman Elrayah Omar Hassabalah</h2>
        <p style={{color:"#6b7280",margin:"4px 0 0"}}>Internal Medicine · Telehealth · Medical Advisory · Wellness · Aesthetic</p>
      </div>
      <textarea
        value={input}
        onChange={e=>setInput(e.target.value)}
        placeholder="Enter your clinical query..."
        rows={4}
        style={{width:"100%",background:"#161b29",border:"1px solid #2a3040",borderRadius:8,color:"#e8e0d0",padding:12,fontSize:14,boxSizing:"border-box",fontFamily:"sans-serif"}}
      />
      <button onClick={run} disabled={loading}
        style={{marginTop:10,background:loading?"#2a2f3e":"#D4A017",color:loading?"#6b7280":"#000",border:"none",borderRadius:8,padding:"10px 24px",cursor:loading?"not-allowed":"pointer",fontWeight:700,fontSize:14}}>
        {loading?"Generating...":"▶ Run"}
      </button>
      {response && (
        <div style={{marginTop:20,background:"#161b29",border:"1px solid #D4A01744",borderRadius:8,padding:16}}>
          <div style={{color:"#D4A017",fontWeight:700,marginBottom:8}}>AI Response:</div>
          <div style={{lineHeight:1.8,whiteSpace:"pre-wrap",fontSize:14}}>{response}</div>
        </div>
      )}
      <div style={{textAlign:"center",marginTop:40,fontSize:11,color:"#2a3050"}}>
        Dr. Osman Elrayah · AI Dashboard · Powered by Claude
      </div>
    </div>
  );
}
