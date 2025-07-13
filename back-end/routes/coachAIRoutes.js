const express = require('express');
const { authenticate } = require('../services/authService');
const Groq = require("groq-sdk");

const router = express.Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

router.post('/ask', authenticate, async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: "Missing 'prompt' in request body" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content || "No response from model";
    res.json({ reply: answer });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    res.status(500).json({ error: "Failed to get completion" });
  }
});

module.exports = router;
