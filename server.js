import express from 'express';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 3001;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());

app.post('/api/generate-questions', async (req, res) => {
  const { noOfQuestions, difficulty, query } = req.body;
  const promptMessage = `Generate ${noOfQuestions} ${difficulty} questions with 4 options in an array format on the topic: ${query}.

    Each question should be structured in JSON format with the following keys:
    - 'question': the text of the question.
    - 'options': An array of 4 options, each option as a string.
    - 'correct_option': The correct option (must match one of the options).
    - 'difficulty': The difficulty level of the question ('easy', 'medium', or 'hard').
    
    Output the result as an array of JSON objects. with the structure described. 
    Dont put anything else. Only valid Array.
    
    Example format:
    [
      {
        "question": "What is the capital of France?",
        "options": ["Paris", "London", "Berlin","Rome"],
        "correct_option": "Paris",
        "difficulty": "easy"
      }
    ]`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: promptMessage,
        },
      ],
      model: 'llama-3.1-8b-instant',
    });

    res.json(JSON.parse(completion.choices?.[0]?.message?.content || '[]'));
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Error generating questions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});