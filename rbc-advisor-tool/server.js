const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/generate-email', async (req, res) => {
  const { prompt, client, mode } = req.body;

  try {
    let systemPrompt = '';
    let userMessage = '';

    if (mode === 'basic') {
      systemPrompt = `You are a professional financial advisor email copywriter at RBC Royal Bank. 
Your task is to write warm, professional, client-friendly emails on behalf of financial advisors.
Guidelines:
- Keep the tone warm, professional, and personal
- Reference the client by their first name
- Keep it concise (3-4 short paragraphs max)
- Never use financial jargon
- Sign off with the advisor's name
- Do NOT include a subject line in the body — only write the email body
- The email should feel like it came from a real person, not a template`;

      userMessage = `Write an email based on this request: "${prompt}"

Client Information:
- Name: ${client.name}
- Age: ${client.age}
- Occupation: ${client.occupation}
- Marital Status: ${client.maritalStatus}
- Cultural/Religious Background: ${client.background}
- City: ${client.city}
- Advisor: ${client.advisorName}

Write only the email body. No subject line.`;

    } else if (mode === 'enhanced') {
      systemPrompt = `You are a senior financial advisor and client relationship specialist at RBC Royal Bank.
You have access to detailed client financial data. Your task is to:
1. Briefly analyze the client's financial profile
2. Generate 2-3 subtle, relevant product recommendations woven naturally into the email
3. Write a warm, highly personalized email that feels human — NOT like a sales pitch

Critical rules:
- NEVER dump raw data or metrics into the email
- Recommendations must feel like friendly advice from a trusted advisor, not marketing
- The email should primarily feel personal and warm; product suggestions are secondary
- Use the client's life situation (family, goals, background) to make it feel tailored
- Maximum 4 short paragraphs
- Do NOT include a subject line`;

      userMessage = `Write an enhanced, personalized email based on this request: "${prompt}"

Client Information:
- Name: ${client.name}
- Age: ${client.age}
- Occupation: ${client.occupation}
- Marital Status: ${client.maritalStatus}
- Cultural/Religious Background: ${client.background}
- City: ${client.city}
- Advisor: ${client.advisorName}

Client Financial Profile (use subtly, do NOT quote numbers directly):
- Portfolio Value: ${client.portfolioValue}
- Portfolio Composition: ${client.portfolioComposition}
- Risk Tolerance: ${client.riskTolerance}
- Primary Financial Goals: ${client.financialGoals}
- Recent Life Events: ${client.recentEvents}
- Current Products: ${client.currentProducts}
- Potential Gaps/Opportunities: ${client.opportunities}

First, in 2-3 sentences, briefly note your internal analysis (what you noticed). Then write the email. 
Format your response as:
ANALYSIS: [your brief internal notes]
---
EMAIL:
[the email body]`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    });

    const responseText = message.content[0].text;

    if (mode === 'enhanced') {
      const parts = responseText.split('---');
      const analysis = parts[0].replace('ANALYSIS:', '').trim();
      const email = parts[1] ? parts[1].replace('EMAIL:', '').trim() : responseText;
      res.json({ email, analysis });
    } else {
      res.json({ email: responseText });
    }
  } catch (error) {
    console.error('Anthropic API error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`RBC Advisor API server running on port ${PORT}`);
});
