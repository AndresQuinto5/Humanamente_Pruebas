import React, { useState, useEffect } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';
import { ResultsProvider } from './Components/ResultsContext';
import { useResults } from './Components/ResultsContext';

//1. SDQ-CAS
//2. BECK II
//3. BAI
//4. PROBIOTICOS TAMIZAJE
//5. ADHERENCIA MEDITERRANEO
//6. VITAMINA D
//8. ESCALA DE DESESPERANZA DE BECK
//9. Cuestionario Salamanca de Trastornos de la Personalidad 
function App() {
  const { results, addResult } = useResults(); // Obtener el estado y las funciones desde el contexto
  const [currentTestId, setCurrentTestId] = useState("8");  // Cambia esto para cargar una prueba diferente
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const isTestCompleted = (testId) => testId in results;

  useEffect(() => {
    if (currentTestId) {
      setLoading(true);
      const test = questionsData.find(test => test.testId === currentTestId);
      if (test) {
        setQuestions(test.questions);
        setScores(Array(test.questions.length).fill(null));
      } else {
        console.error('Test no encontrado: ' + currentTestId);
        alert('Test no encontrado: ' + currentTestId); // Mostrar alerta al usuario
        setCurrentTestId(null); // Resetear el testId actual
      }
      setLoading(false);
    }
  }, [currentTestId]);

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
    } 
    else if (currentTestId === "2") {
      return scores.reduce((a, b) => a + b, 0);
    }
    else if (currentTestId === "3") {
      return scores.reduce((a, b) => a + b, 0);
    }
    else if (currentTestId === "4") { 
      return scores.reduce((a, b) => a + b, 0); 
    }
    else if (currentTestId === "5") {
      return scores.reduce((a, b) => a + b, 0); 
    }
    else if (currentTestId === "6") {
      return scores.reduce((a, b) => a + b, 0); 
    }
    else if (currentTestId === "8") {
      const scoreIndexes = {
        afectivo: [0, 5, 12, 14, 18], // ítems 1, 6, 13, 15, 19 (indice empieza en 0)
        motivacional: [1, 2, 8, 10, 11, 15, 16, 19], // ítems 2, 3, 9, 11, 12, 16, 17, 20
        cognitivo: [3, 6, 7, 13, 17], // ítems 4, 7, 8, 14, 18
      };
  
      const factorScores = {
        afectivo: scoreIndexes.afectivo.reduce((acc, index) => acc + scores[index], 0),
        motivacional: scoreIndexes.motivacional.reduce((acc, index) => acc + scores[index], 0),
        cognitivo: scoreIndexes.cognitivo.reduce((acc, index) => acc + scores[index], 0),
      };
  
      const totalScore = scores.reduce((a, b) => a + b, 0);
  
      return {
        totalScore,
        ...factorScores
      };
    }
    else if (currentTestId === "9") {
      // Ítems correspondientes a cada subescala
      const groupAIndexes = [0, 1, 2, 3, 4, 5]; // PAR, ESQ, EQT
      const groupBIndexes = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // HIST, ANT, NAR, IE IMP, IE LIM
      const groupCIndexes = [16, 17, 18, 19, 20, 21]; // ANAN, DEP, ANS
    
      // Calcula los puntajes por grupo
      const groupAScores = groupAIndexes.map(index => scores[index] || 0); // Añade || 0 para manejar undefined/null
      const groupBScores = groupBIndexes.map(index => scores[index] || 0);
      const groupCScores = groupCIndexes.map(index => scores[index] || 0);
    
      // Retorna los resultados por subescala
      return {
        PAR: groupAScores[0] + groupAScores[1],
        ESQ: groupAScores[2] + groupAScores[3],
        EQT: groupAScores[4] + groupAScores[5],
        HIST: groupBScores[0] + groupBScores[1],
        ANT: groupBScores[2] + groupBScores[3],
        NAR: groupBScores[4] + groupBScores[5],
        IE_IMP: groupBScores[6] + groupBScores[7],
        IE_LIM: groupBScores[8] + groupBScores[9],
        ANAN: groupCScores[0] + groupCScores[1],
        DEP: groupCScores[2] + groupCScores[3],
        ANS: groupCScores[4] + groupCScores[5],
      };
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
      <nav>
        {questionsData.map((test) => (
          <button
            key={test.testId}
            disabled={isTestCompleted(test.testId)}
            onClick={() => setCurrentTestId(test.testId)}
            style={{ margin: '5px' }}  // Asegúrate de que los botones tengan espacio y sean visibles
          >
            {test.testName || 'Nombre no definido'} {isTestCompleted(test.testId) ? '✓' : ''}
          </button>
        ))}
      </nav>
      {loading ? (
        <p>Cargando...</p>
      ) : currentTestId && (
        <div>
          {!finished ? (
            <div>
              <Question 
                question={questions[currentQuestion]} 
                handleAnswerClick={handleAnswerClick}
              />
              {currentQuestion > 0 && (
                <button onClick={goToPreviousQuestion}>Regresar</button>
              )}
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
