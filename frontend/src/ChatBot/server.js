// server.js
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config(); // API KEY 보안을 위해 사용

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env 파일에 저장
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 항공사 관리 시스템의 전문 상담원입니다." },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "챗봇 응답 중 오류가 발생했습니다." });
  }
});

app.listen(8001, () => console.log('Server running on port 8001'));