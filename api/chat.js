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
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const systemPrompt = `أنت مساعد طبي متخصص لـ د. عثمان الريح، 
    طبيب باطنية وغدد صماء بخبرة 25 عاماً. 
    ساعده في تحليل الحالات السريرية، مراجعة الأدلة العلمية، 
    وإدارة السكري والغدة الدرقية والأمراض المزمنة. 
    كن دقيقاً وعلمياً ومختصراً.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            ...history,
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'Gemini API error', 
        details: errorData 
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ 
      response: text,
      model: 'gemini-1.5-flash'
    });

  } catch (error) {
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
  }
