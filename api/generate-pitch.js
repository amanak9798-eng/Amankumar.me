
// This is a serverless function (e.g., for Vercel or Netlify)
// It acts as a secure backend to handle the Gemini API call.

export default async function handler(request, response) {
  // 1. We only accept POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = request.body;

  // 2. Ensure the prompt is not empty
  if (!prompt) {
    return response.status(400).json({ message: 'Prompt is required' });
  }

  // 3. Get the API key from environment variables (NEVER hardcode it)
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
      return response.status(500).json({ message: 'API key is not configured on the server.' });
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    // 4. Securely call the Gemini API from the backend
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Gemini API Error:', errorText);
      return response.status(apiResponse.status).json({ message: `Gemini API error: ${errorText}` });
    }

    const result = await apiResponse.json();
    const text = result.candidates[0].content.parts[0].text;

    // 5. Send the result back to the frontend
    return response.status(200).json({ text });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return response.status(500).json({ message: 'An internal error occurred.' });
  }
}
