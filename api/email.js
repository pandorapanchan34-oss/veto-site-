export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'pandorapanchan34@gmail.com',
        subject: '【VETO】新規登録: ' + email,
        html: '<p>新規メール登録がありました。</p><p><strong>' + email + '</strong></p>'
      })
    });

    if (r.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Send failed' });
    }
  } catch(e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
