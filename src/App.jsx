import React, { useState } from 'react';
import './App.css';

// Note: This import will only work if you're using a bundler that supports it
// and if you've set up environment variables correctly
import { Groq } from 'groq-sdk';

function App() {
  const [query, setQuery] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleQueryInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleNumQuestionsInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setNoOfQuestions(value);
    }
  };

  const handleDifficultyInputChange = (e) => {
    setDifficulty(e.target.value);
  };

  const createQuestionsWithGroqApi = async () => {
    setIsLoading(true);
  
    try {
      // This part would typically be in a separate server-side function
       const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY, // Securely use API key from Vercel environment variables
        });
      
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

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: promptMessage,
          },
        ],
        model: 'llama-3.1-8b-instant',
      });

      const generatedQuestions = JSON.parse(completion.choices?.[0]?.message?.content || '[]');
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('There was an error generating questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createQuestionsWithGroqApi();
  };

  return (
    <div className="main-container">
      <h1>Gen AI Web App</h1>
      <div className="form-container">
        <div>
          <label>Enter Query:</label>
          <input
            type="text"
            className="query-input"
            placeholder="Enter Query"
            onChange={handleQueryInputChange}
          />
        </div>

        <div>
          <label>No of Questions: {noOfQuestions}</label>
          <input
            type="range"
            min={1}
            max={10}
            value={noOfQuestions}
            className="questions-input"
            onChange={handleNumQuestionsInputChange}
          />
        </div>

        <div>
          <label>Difficulty:</label>
          <select className="difficulty-input" value={difficulty} onChange={handleDifficultyInputChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Questions"}
        </button>
        {isLoading && <p>Loading...</p>}
      </div>

      {questions.length > 0 && (
        <div className="questions-container">
          <h2>Generated Questions:</h2>
          {questions.map((q, index) => (
            <div key={index} className="question">
              <p>
                <strong>Question {index + 1}:</strong> {q.question}
              </p>
              <ul>
                {q.options.map((option, optIndex) => (
                  <li key={optIndex}>{option}</li>
                ))}
              </ul>
              <p>
                <strong>Correct Answer:</strong> {q.correct_option}
              </p>
              <p>
                <strong>Difficulty:</strong> {q.difficulty}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
