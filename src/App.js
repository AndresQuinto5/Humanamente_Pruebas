import React, { useState, useEffect } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';
import { ResultsProvider } from './Components/ResultsContext';
import { useResults } from './Components/ResultsContext';


function App() {
  const { results, addResult } = useResults(); // Obtener el estado y las funciones desde el contexto
  const [currentTestId, setCurrentTestId] = useState("1");  // Cambia esto para cargar una prueba diferente
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const test = questionsData.find(test => test.testId === currentTestId);

    if (test) {
      setQuestions(test.questions);
      setScores(Array(test.questions.length).fill(null));
      setLoading(false);
    } else {
      console.error('Test no encontrado');
      setLoading(false);
    }
  }, [currentTestId]);

  useEffect(() => {
    if (finished) {
      const totalScore = calculateTotalScore();
      addResult(currentTestId, totalScore);  // Usar addResult para actualizar el estado global
      alert(`Prueba completada. Tu puntuación total es ${JSON.stringify(totalScore)}`);
      resetTest();
    }
  }, [finished]);

  useEffect(() => {
    console.log("Resultados globales actualizados:", results);
  }, [results]);
  
  const handleAnswerClick = (score) => {
    const newScores = [...scores];
    newScores[currentQuestion] = score;
    setScores(newScores);

    console.log(`ID del ítem: ${currentQuestion}, Valor de la respuesta: ${score}`);

    if (currentQuestion === questions.length - 1) {
      setFinished(true);
    } else {
      goToNextQuestion();
    }
  };

  const calculateTotalScore = () => {
    if (currentTestId === "1") {
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
    } else if (currentTestId === "2") {
      return scores.reduce((a, b) => a + b, 0);
    }
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
