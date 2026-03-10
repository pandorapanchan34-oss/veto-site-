export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // Anthropic側からエラーが返ってきた場合の処理
    if (!response.ok) {
      console.error("Anthropic API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "API Error" });
    }

    // データ構造の安全な確認
    if (data.content && data.content.length > 0) {
      return res.status(200).json({
        reply: data.content[0].text
      });
    } else {
      throw new Error("Unexpected API response format");
    }

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
}
