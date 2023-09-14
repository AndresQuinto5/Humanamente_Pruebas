import React from 'react';

function Question({ question, handleAnswerClick }) {
    return (
      <div>
        <h2>{question.statement}</h2>
        {question.options.map((option, index) => (
          <button 
            key={index}
            onClick={() => handleAnswerClick(question.reversePoints ? question.points[2 - index] : question.points[index])}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
  
  export default Question;
  