import React, { useState, useEffect } from 'react';
import Question from './Components/Question';
import { questionsData } from './Components/questions.js';
import { useResults } from './Components/ResultsContext';
import calculateTotalScore from './utils/ScoreCalculator';
import FormInput from './Components/FormInput'; // Asegúrate de que esta ruta sea correcta
import "./App.css"

function App() {
  const { results, addResult } = useResults(); 
  const [currentTestId, setCurrentTestId] = useState("2");  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [showTransition, setShowTransition] = useState(false); // Nuevo estado para la transición
  const isTestCompleted = (testId) => {
    return results.hasOwnProperty(testId);
  };
    const [alertShown, setAlertShown] = useState(false);

  //Aqui comienzan las declaraciones para el formulario
  const [formCompleted, setFormCompleted] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    fechaNacimiento: "",
    email: "",
    // genero: "",
    referente: "",
  });
  
  // Definición de los inputs del formulario
  const inputs = [
    {
      id: 1,
      name: "nombre",
      type: "text",
      placeholder: "Nombre completo",
      errorMessage: "El nombre es requerido",
      label: "Nombre",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Correo electrónico",
      errorMessage: "Debe ser una dirección de correo electrónico válida",
      label: "Correo Electrónico",
      required: true,
    },    
    {
      id: 3,
      name: "fechaNacimiento",
      type: "date",
      placeholder: "Fecha de nacimiento",
      label: "Fecha de Nacimiento",
      required: true,
    },
    // {
    //   id: 4,
    //   name: "genero",
    //   type: "select",
    //   label: "Género",
    //   options: ["Masculino", "Femenino", "Otro"],
    //   required: true,
    // },
    {
      id: 5,
      name: "referente",
      type: "text",
      placeholder: "Médico o psicólogo tratante",
      errorMessage: "Este campo es requerido",
      label: "Referente",
      required: true,
    },
  ];

  // Este efecto se ejecutará cada vez que currentTestId cambie
  // y se asegurará de que las preguntas y las puntuaciones se actualicen
  useEffect(() => {
    if (currentTestId) {
      setLoading(true);
      const test = questionsData.find(test => test.testId === currentTestId);
      if (test) {
        setQuestions(test.questions);
        setScores(Array(test.questions.length).fill(null));
      } else {
        // alert('Test no encontrado: ' + currentTestId);
        setCurrentTestId(null);
      }
      setLoading(false);
    }
  }, [currentTestId]);

  // // Este efecto se ejecutará cada vez que finished cambie y se asegurará de que se muestre el mensaje de alerta solo una vez por prueba el cual indica que la prueba se ha completado
  // useEffect(() => {
  //   if (finished && !alertShown) {
  //     const totalScore = calculateTotalScore(currentTestId, scores, questions);
  //     addResult(currentTestId, totalScore); 
  //     // alert(`Prueba completada. Tu puntuación total es ${JSON.stringify(totalScore)}`);
  //     setAlertShown(true); // Asegúrate de que el alert se muestra solo una vez
  //   }
  // }, [finished, currentTestId, scores, questions, addResult, alertShown]);

  // Este useEffect se asegurará de que cada vez que results se actualice, se imprima el estado actualizado
  useEffect(() => {
    console.log('Todos los resultados hasta ahora:', results);
  }, [results]);

  // Manejador de clic en respuesta actualizado para manejar el fin de las preguntas correctamente
  const handleAnswerClick = (score) => {
    const updatedScores = [...scores];
    updatedScores[currentQuestion] = score;

    const isLastQuestion = currentQuestion === questions.length - 1;
    setScores(updatedScores);

    if (isLastQuestion) {
      setFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const renderTestButtons = () => (
    <div className="test-buttons-container">
      {questionsData.map((test) => (
        <button
          key={test.testId}
          className={`test-button ${currentTestId === test.testId ? 'active-test' : ''}`}
          disabled={isTestCompleted(test.testId)}
          onClick={() => setCurrentTestId(test.testId)}
        >
          {test.testName || 'Nombre no definido'} {isTestCompleted(test.testId) ? '✓' : ''}
        </button>
      ))}
    </div>
  );

  // Mover la lógica de goToNextTest dentro de handleFinishTest
  const handleFinishTest = () => {
    const totalScore = calculateTotalScore(currentTestId, scores, questions);
    addResult(currentTestId, totalScore);
    setShowTransition(true); // Mostrar transición
    setTimeout(() => {
      // Busca la siguiente prueba no completada
      const nextTest = questionsData.find(
        (test) => !isTestCompleted(test.testId) && test.testId !== currentTestId
      );
      
      if (nextTest) {
        setCurrentTestId(nextTest.testId);
        setCurrentQuestion(0);
        setScores(Array(nextTest.questions.length).fill(null));
      } else {
        setCurrentTestId(null); // No hay más pruebas, se establece a null
      }
      setShowTransition(false); // Oculta la pantalla de transición
      setFinished(false); // Restablece para la nueva prueba
      }, 1000); // 1 segundos de transición
  };

  // Este efecto maneja la finalización de una prueba y pasa a la siguiente
  useEffect(() => {
    if (finished) {
      handleFinishTest();
    }
  }, [finished, currentTestId, scores, questions]); // Asegúrate de incluir todas las dependencias necesarias
  
  useEffect(() => {
    if (scores.some(score => score !== null)) { // Verificar si hay al menos una respuesta
      // console.log(`Respuestas para la prueba ${currentTestId}:`);
      questions.forEach((question, index) => {
        // console.log(`Pregunta ${index + 1}: ${question.statement}, Respuesta: ${scores[index]}`);
      });
    }
  }, [scores, questions, currentTestId]); // Dependencias del efecto secundario

// Funciones para manejar el formulario
const handleSubmit = (e) => {
  e.preventDefault();
  if (e.target.checkValidity()) {
    addResult("formulario", formValues);
    setFormCompleted(true);
    console.log("Formulario completado");
    console.log(formValues);
  } else {
    console.error("El formulario tiene errores");
  }
};

const onChange = (e) => {
  setFormValues({ ...formValues, [e.target.name]: e.target.value });
};

// Lógica para renderizar el formulario o las pruebas
if (!formCompleted) {
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>Tu información</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={formValues[input.name]}
            onChange={onChange}
          />
        ))}
        <button type="submit" className="ComenzarP">Comenzar Pruebas</button>
      </form>
    </div>
  );
}
if (showTransition) {
 // Pantalla de transición con spinner
    return (
      <div className="App transition-screen">
        <div className="spinner"></div>
      </div>
    );
}
// Renderizado condicional basado en si se completaron todas las pruebas o no
else if (currentTestId === null) {
  // Mensaje de pruebas completadas
  return (
    <div className="App">
      <div className="tests-completed-message">
        <h2>Todas las pruebas se han completado. No es necesario realizar nada más.</h2>
        {/* Opcional: agregar otros componentes o mensajes */}
      </div>
    </div>
  );
} else {
  // Renderizado normal de las pruebas
  return (
    <div className="App">
      {/* <h1>Prueba Psicométrica</h1> */}
      {renderTestButtons()}
      <h2>{currentTestId && questionsData.find(test => test.testId === currentTestId)?.testName}</h2>
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
}

export default App;
