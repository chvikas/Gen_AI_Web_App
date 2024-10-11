import React, { useState } from 'react';
import './App.css';

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
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noOfQuestions,
          difficulty,
          query,
        }),
      });
  
      const generatedQuestions = await response.json();
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