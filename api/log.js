// api/log.js
// 相談ログ保存

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const { input, reply } = req.body;

    const log = {
      input,
      reply,
      time: new Date().toISOString()
    };

    console.log("VETO_LOG:", JSON.stringify(log));

    return res.status(200).json({
      status: "logged"
    });

  } catch (err) {

    console.error("log error:", err);

    return res.status(500).json({
      error: "log failed"
    });

  }

}
