import React, { useState, useEffect } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';
import { useResults } from './Components/ResultsContext';
import calculateTotalScore from './utils/ScoreCalculator';


function App() {
  const { results, addResult } = useResults(); 
  const [currentTestId, setCurrentTestId] = useState("1");  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const isTestCompleted = (testId) => testId in results;
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (currentTestId) {
      setLoading(true);
      const test = questionsData.find(test => test.testId === currentTestId);
      if (test) {
        setQuestions(test.questions);
        setScores(Array(test.questions.length).fill(null));
      } else {
        alert('Test no encontrado: ' + currentTestId);
        setCurrentTestId(null);
      }
      setLoading(false);
    }
  }, [currentTestId]);

  useEffect(() => {
    if (finished && !alertShown) {
      const totalScore = calculateTotalScore(currentTestId, scores, questions);
      addResult(currentTestId, totalScore); 
      alert(`Prueba completada. Tu puntuación total es ${JSON.stringify(totalScore)}`);
      setAlertShown(true); // Asegúrate de que el alert se muestra solo una vez
    }
  }, [finished, currentTestId, scores, questions, addResult, alertShown]);
  // Este useEffect se asegurará de que cada vez que results se actualice, se imprima el estado actualizado
  useEffect(() => {
    console.log('Todos los resultados hasta ahora:', results);
  }, [results]);

  const handleAnswerClick = (score) => {
    setScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[currentQuestion] = score;
      return newScores;
    });
  
    // Si no es la última pregunta, avanza a la siguiente
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Si es la última pregunta, termina el test después de actualizar las puntuaciones
      setFinished(true); // Esto debería disparar el useEffect que finaliza el test
    }
  };
  

  const renderTestButtons = () => (
    questionsData.map((test) => (
      <button
        key={test.testId}
        disabled={isTestCompleted(test.testId)}
        onClick={() => setCurrentTestId(test.testId)}
      >
        {test.testName || 'Nombre no definido'} {isTestCompleted(test.testId) ? '✓' : ''}
      </button>
    ))
  );

  const goToNextTest = () => {
    const currentIndex = questionsData.findIndex((test) => test.testId === currentTestId);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < questionsData.length) {
      const nextTestId = questionsData[nextIndex].testId;
      setCurrentTestId(nextTestId);
      setCurrentQuestion(0);
      setScores(Array(questionsData[nextIndex].questions.length).fill(null));
      // No es necesario cambiar 'finished' ni 'alertShown' aquí
    } else {
      console.log("No hay más pruebas disponibles.");
      setCurrentTestId(null); // Puedes establecer un estado para mostrar un mensaje final si lo deseas
    }
  };

  const handleFinishTest = () => {
    const totalScore = calculateTotalScore(currentTestId, scores, questions);
    addResult(currentTestId, totalScore);
    goToNextTest(); 
    setAlertShown(false); // Reset the alert shown state
  };

  useEffect(() => {
    // If finished is true, then complete the test and reset finished state
    if (finished) {
      handleFinishTest();
      setFinished(false); // Reset finished state for the new test
    }
  }, [finished]); // Effect for handling completion of a test
  
  useEffect(() => {
    if (scores.some(score => score !== null)) { // Verificar si hay al menos una respuesta
      console.log(`Respuestas para la prueba ${currentTestId}:`);
      questions.forEach((question, index) => {
        console.log(`Pregunta ${index + 1}: ${question.statement}, Respuesta: ${scores[index]}`);
      });
    }
  }, [scores, questions, currentTestId]); // Dependencias del efecto secundario


  return (
    <div className="App">
      <h1>Prueba Psicométrica</h1>
      <nav>{renderTestButtons()}</nav>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        currentTestId && questions && questions.length > 0 && currentQuestion < questions.length && (
          <Question 
            question={questions[currentQuestion]} 
            handleAnswerClick={handleAnswerClick}
          />
        )
      )}
    </div>
  );
}

  


export default App;
