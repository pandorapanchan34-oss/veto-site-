// api/consult.js
// Vercel Serverless Function
// Claude APIを安全に呼び出す

export default async function handler(req, res) {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST以外拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages が必要です' });
  }

  try {

    console.log("Claude API 呼び出し開始");

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,

        system: `あなたは「VETO」というAI導入失敗防止サービスのAI診断アシスタントです。

企業のAI導入計画を3ステップで診断します。

【STEP 1】導入目的確認
何のためにAIを入れるのか、成功の定義は何かを確認する。

【STEP 2】組織体制確認
現場は理解しているか、推進人材はいるか、経営層の関与度を確認する。

【STEP 3】技術・リスク確認
ツール、データ、ベンダー依存リスクを確認する。

返答ルール
・必ず「STEP X —」で始める
・200字以内
・確認質問を1〜2個入れる
・該当する場合は
⚠ PATTERN:
を付ける

失敗パターン
リテラシー不足型
KPI不在型
現場拒絶型
シャドーAI型
短期成果強制型
AI幻覚型
ベンダーロック型
スコープ爆発型

社名や個人名は聞かない。`,

        messages: messages
      })
    });

    const data = await claudeRes.json();

    if (!claudeRes.ok) {
      console.error("Claude API エラー:", data);
      return res.status(500).json({
        error: "Claude API呼び出し失敗",
        detail: data
      });
    }

    const reply =
      data?.content?.[0]?.text ||
      "診断生成に失敗しました。";

    return res.status(200).json({
      reply
    });

  } catch (err) {

    console.error("Server error:", err);

    return res.status(500).json({
      error: "サーバーエラー",
      detail: err.message
    });
  }
}
