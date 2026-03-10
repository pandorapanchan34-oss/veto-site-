export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini raw:", JSON.stringify(data));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AIエラー";

    res.status(200).json({ text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ text: "AIエラー" });
  }

}
