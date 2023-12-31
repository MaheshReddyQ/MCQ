import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);

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
    if (!nameSubmitted) {
      // If the name is not submitted, prevent automatic progression
      return;
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    return (
      <div className="question-container">
        <h2>{question.question_text}</h2>
        <ul>
          {question.choices.map((choice) => (
            <li key={choice.id}>
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
        {nameSubmitted && (
          <button className="next-button" onClick={handleChoiceSelect}>
            Next
          </button>
        )}
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
          <a href="https://www.facebook.com/profile.php?id=100092577547469" target="_blank" className="icon-link" rel="noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/tmachineschoolofpython/" target="_blank" className="icon-link" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/showcase/t-machine-school-of-python/" target="_blank" className="icon-link" rel="noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/@T-MachineSchoolofPython" target="_blank" className="icon-link" rel="noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNameSubmit = () => {
    // Add any validation for name if needed
    if (name.trim() !== '') {
      setCurrentQuestionIndex(0); // Start from the first question
      setShowResult(false); // Reset the showResult state
      setNameSubmitted(true); // Mark the name as submitted
    }
  };

  const handleNameInputChange = (e) => {
    setName(e.target.value);
  };

  // Function to save the result in PostgreSQL
  const saveResult = async () => {
    try {
      await axios.post('http://localhost:8001/api/store-result', { name, score })
        .then((response) => {
          console.log('Result saved successfully!');
          console.log('Response:', response.data);
        })
        .catch((error) => {
          console.error('Error saving result:', error);
        });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };


  // Use useEffect to automatically save the result when showResult is true
  useEffect(() => {
    if (showResult) {
      saveResult();
    }
  }, [showResult]);

  return (
    <div className="App">
      <h1>MCQ Questions</h1>
      {showResult ? (
        renderResult()
      ) : (
        <>
          {!nameSubmitted ? (
            <div className="name-input-container">
              <label htmlFor="nameInput"><strong>Enter your name:- </strong></label>
              <input
                type="text"
                id="nameInput"
                value={name}
                onChange={handleNameInputChange}
                required
              />
              <button className="glow-on-hover" onClick={handleNameSubmit}>
                Submit
              </button>
            </div>
          ) : (
            renderQuestion()
          )}
        </>
      )}
    </div>
  );
};

export default App;
