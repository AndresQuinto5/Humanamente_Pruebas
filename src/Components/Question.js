import React from 'react';
import './Question.css';

function Question({ question, handleAnswerClick }) {
  return (
    <div className="question-container">
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
    </div>
  );
}
  
  export default Question;
  