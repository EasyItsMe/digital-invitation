// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/rsvp
// Endpoint backend serverless untuk menyimpan & membaca RSVP dari Supabase
// ==============================================================================

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qbjiljgbdvzvthtszjhy.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_YYDgmKmKCQnSljYr4HCFgg_AAtAJQtA';

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(200).json({
      status: 'local_fallback',
      message: 'Supabase environment variables not configured on Vercel. Using localStorage fallback.',
      configured: false
    });
  }

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rsvp_wishes`;

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${endpoint}?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }

      const data = await response.json();
      return res.status(200).json({ status: 'ok', data: data, configured: true });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { name, attendance, message } = body;

      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: name.trim(),
          attendance: attendance ? attendance.trim() : 'Hadir',
          message: message.trim()
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }

      const created = await response.json();
      return res.status(201).json({ status: 'ok', data: created[0] || created, configured: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Missing ID parameter' });
      }

      const response = await fetch(`${endpoint}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }

      return res.status(200).json({ status: 'ok', message: 'Deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

