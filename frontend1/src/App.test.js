import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [showResult, setShowResult] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/random-questions/');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleChoiceSelect = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const shuffleChoices = (choices) => {
    // Create a copy of the choices array
    const shuffledChoices = [...choices];

    // Shuffle the choices using Fisher-Yates algorithm
    for (let i = shuffledChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
    }

    return shuffledChoices;
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const shuffledChoices = shuffleChoices(question.choices);

    return (
      <div className="question-container">
        <h2>{question.question_text}</h2>
        <ul>
          {shuffledChoices.map((choice) => (
            <li key={choice.id} className="choice">
              <label>
                <input
                  type="radio"
                  name={`choice-${currentQuestionIndex}`}
                  value={choice.is_correct}
                  onChange={() => handleChoiceSelect(choice.is_correct)}
                  required
                />
                {choice.choice_text}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResult = () => {
    const totalQuestions = questions.length;

    return (
      <div className="result-container">
        <p>Score: {score}/{totalQuestions}</p>
        <p className={score < 4 ? 'failure' : 'success'}>
          {score < 4
            ? 'Thanks for submitting. Your score is not good. Please refer to the previous videos to improve your skills.'
            : 'Thanks for submitting. Your score is good.'}
        </p>
        <p>Submitted by: {name}</p>
        <div className="contact-links1">
          <a href="https://www.facebook.com/profile.php?id=100092577547469" target="_blank" className="icon-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/tmachineschoolofpython/" target="_blank" className="icon-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/showcase/t-machine-school-of-python/" target="_blank" className="icon-link">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/@T-MachineSchoolofPython" target="_blank" className="icon-link">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="App">
      {name ? (
        <>
          <h1>MCQ Questions</h1>
          {renderQuestion()}
          {showResult && currentQuestionIndex >= questions.length - 1 && renderResult()}
          {!showResult && currentQuestionIndex < questions.length - 1 && (
            <button className="next-button" onClick={handleChoiceSelect}></button>
          )}
        </>
      ) : (
        <div className="name-input-container">
          <label htmlFor="nameInput">Enter your name:</label>
          <input
            type="text"
            id="nameInput"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
      )}
    </div>
  );
};

export default App;
