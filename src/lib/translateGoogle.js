// lib/translateGoogle.js
import axios from 'axios';

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

export async function translateGoogle(text, targetLang = 'en') {
  if (!text || !text.trim()) return text;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        q: text,
        source: 'es',
        target: targetLang,
        format: 'text',
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (err) {
    console.error('Error con Google Translate:', err.response?.data || err.message);
    return text; // fallback
  }
}
