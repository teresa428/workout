
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "strength_training_log";

export default function Home() {
  const [log, setLog] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setLog(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(log));
  }, [log]);

  const handleAdd = () => {
    if (!note.trim()) return;
    const newEntry = { date: new Date().toLocaleDateString(), note };
    setLog([newEntry, ...log]);
    setNote("");
  };

  const suggestNext = () => {
    if (log.length === 0) return "Start training and log your first session!";
    const last = log[0].note.toLowerCase();
    if (last.includes("deadlift")) return "Try a push day next: Bench, Shoulder Press, Core";
    if (last.includes("bench") || last.includes("臥推")) return "Go for legs: Squats, Lunges, Leg Press";
    if (last.includes("lunge") || last.includes("腿")) return "Pull day: Deadlifts, Rows, Pull-downs";
    return "Keep alternating muscle groups and progressively overload.";
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">🏋️ Strength Log</h1>

      <div className="mb-4 border p-4 rounded">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Today’s training note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Entry</button>
      </div>

      <div className="mb-4 border p-4 rounded">
        <p className="text-lg font-medium">💡 Next Workout Suggestion:</p>
        <p>{suggestNext()}</p>
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
