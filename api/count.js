
// api/consult.js
// Vercel Serverless Function
// ブラウザから直接Claude APIを叩かない。必ずここを経由させる。

export default async function handler(req, res) {
  // CORSヘッダー（自分のVercelドメインからのみ許可）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（ブラウザのpreflight）に応答
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages が必要です' });
  }

  try {
    // ── Claude API呼び出し ──
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `あなたは「VETO」というAI導入失敗防止サービスのAI診断アシスタントです。
企業のAI導入計画を3ステップで診断します。
