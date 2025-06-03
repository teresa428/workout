// Simple Strength Training Log App
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "strength_training_log";

export default function StrengthLogApp() {
  const [log, setLog] = useState([]);
  const [note, setNote] = useState("");
  const [suggestion, setSuggestion] = useState("Generating personalized suggestion...");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setLog(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  useEffect(() => {
    if (log.length > 0) {
      generateChatGPTSuggestion();
    } else {
      setSuggestion("Start training and log your first session!");
    }
  }, [log]);

  const extractDateFromNote = (text) => {
    const match = text.match(/(\d{1,2})[\/\\\-](\d{1,2})/);
    if (match) {
      const now = new Date();
      const year = now.getFullYear();
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return new Date().toLocaleDateString();
  };

  const handleAdd = () => {
    if (!note.trim()) return;
    const date = extractDateFromNote(note);
    const newEntry = { date, note };
    const newLog = [newEntry, ...log];
    setLog(newLog);
    setNote("");
  };

  const generateChatGPTSuggestion = () => {
    const fullNotes = log.map((entry) => `${entry.date}: ${entry.note}`).join("\n");
    const prompt = `Based on the following strength training log, suggest the next workout with detailed weight, reps, and sets. Be specific:\n${fullNotes}`;

    fetch("/api/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    })
      .then(res => res.json())
      .then(data => setSuggestion(data.message || "Could not generate suggestion."))
      .catch(() => setSuggestion("Error generating suggestion."));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">🏋️ Strength Log</h1>

      <div className="mb-4 border p-4 rounded">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Training note... (start with a date like 5/27)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Entry</button>
      </div>

      <div className="mb-4 border p-4 rounded">
        <p className="text-lg font-medium">💡 Next Workout Suggestion:</p>
        <p>{suggestion}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">📓 History</h2>
      <div className="space-y-2">
        {log.map((entry, i) => (
          <div key={i} className="border p-4 rounded">
            <p className="text-sm text-gray-500">{entry.date}</p>
            <p>{entry.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
