import React from 'react';
import './Question.css';

function Question({ question, handleAnswerClick, handlePreviousClick, instructions, testName, currentQuestion }) {
  return (
    <div className="question-container">
      <div className="test-title">
        <h2>{testName}</h2>
      </div>
      {instructions && (
        <div className="test-instructions">
          <p>{instructions}</p>
        </div>
      )}
      <div className="question-statement">
        <h2>{question.statement}</h2>
      </div>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => handleAnswerClick(question.points[index])}
          >
            {option}
          </button>
        ))}
      </div>
      {currentQuestion > 0 && (
        <div className="navigation-buttons-container">
          <button className="prev-button" onClick={handlePreviousClick}>
            Anterior
          </button>
        </div>
      )}
    </div>
  );
}
  
export default Question;
