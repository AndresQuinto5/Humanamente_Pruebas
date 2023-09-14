import React, { useState, useEffect } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const test = questionsData.find(test => test.testId === "1");

    if (test) {
      setQuestions(test.questions);
      setScores(Array(test.questions.length).fill(null));
      setLoading(false);
    } else {
      console.error('Test no encontrado');
      setLoading(false);
    }
  }, []);

  const handleAnswerClick = (score) => {
    const newScores = [...scores];
    newScores[currentQuestion] = score;
    setScores(newScores);

    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      const scoresByCategory = calculateScoresByCategory();
      alert(`Prueba completada. Tus puntuaciones por categoría son: ${JSON.stringify(scoresByCategory)}`);
      resetTest();
    } else {
      goToNextQuestion();
    }
  };

  const calculateScoresByCategory = () => {
    const scoresByCategory = {};

    questions.forEach((question, index) => {
      const category = question.category;
      const score = scores[index];

      if (!scoresByCategory[category]) {
        scoresByCategory[category] = 0;
      }
      scoresByCategory[category] += score;
    });

    return scoresByCategory;
  };

  const goToNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setScores(Array(questions.length).fill(null));
    setFinished(false);
  };

  return (
    <div className="App">
      <h1>Prueba Psicométrica</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {!finished ? (
            <div>
              <Question 
                question={questions[currentQuestion]} 
                handleAnswerClick={handleAnswerClick}
              />
              {currentQuestion > 0 && <button onClick={goToPreviousQuestion}>Regresar</button>}
            </div>
          ) : (
            <button onClick={resetTest}>Reiniciar prueba</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
