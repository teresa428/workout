export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a personal strength training coach." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "No suggestion returned.";
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: "Error generating suggestion." });
  }
}
