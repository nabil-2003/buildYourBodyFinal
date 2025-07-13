const axios = require('axios');
async function callGeminiAPI(userInfo) {
  const prompt = `Generate a ${userInfo.planType} training plan for a ${userInfo.age}-year-old ${userInfo.gender}, weight ${userInfo.weight}kg, height ${userInfo.height}cm, goal: ${userInfo.fitnessGoal}, experience: ${userInfo.experienceLevel}.`;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No plan generated.';
  } catch (err) {
    if (err.response && err.response.status === 429) {
      const error = new Error('Gemini API quota exceeded');
      error.isQuota = true;
      throw error;
    }
    throw new Error('Gemini API unavailable');
  }
}
module.exports = { callGeminiAPI }; 