// /utils/ScoreCalculator.js

// Función para SDQ-CAS
// const calculateSDQ_CAS = (scores, questions) => {
//     const scoresByCategory = {};
//     questions.forEach((question, index) => {
//       const category = question.category;
//       const score = scores[index];
//       if (!scoresByCategory[category]) {
//         scoresByCategory[category] = 0;
//       }
//       scoresByCategory[category] += score;
//     });
//     return scoresByCategory;
//   };
  
  // Función para BECK II, BAI, Probióticos, Adherencia Mediterráneo y Vitamina D
  // Todos estos tests utilizan la misma lógica de cálculo
  const calculateSumOfScores = (scores) => {
    return scores.reduce((a, b) => a + b, 0);
  };
  
  // Función para la Escala de Desesperanza de Beck
  const calculateBeckDesesperanza = (scores) => {
    const scoreIndexes = {
      afectivo: [0, 5, 12, 14, 18],
      motivacional: [1, 2, 8, 10, 11, 15, 16, 19],
      cognitivo: [3, 6, 7, 13, 17],
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
  };
  
  // Función para el Cuestionario Salamanca de Trastornos de la Personalidad
  const calculateSalamanca = (scores) => {
    // Ítems correspondientes a cada subescala
    const groupAIndexes = [0, 1, 2, 3, 4, 5];
    const groupBIndexes = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const groupCIndexes = [16, 17, 18, 19, 20, 21];
  
    // Calcula los puntajes por grupo
    const groupAScores = groupAIndexes.map(index => scores[index] || 0);
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
  };
  
    //Funcion para calificar el test de MDQ Mood Disorder Questionnaire 
  const calculateMDQScore = (scores) => {
    // Sumar los primeros 13 ítems
    const sumFirst13 = scores.slice(0, 13).reduce((sum, score) => sum + score, 0);

    // Obtener respuestas a las preguntas restantes
    const additionalResponses = {
      Item2: scores[13],
      Item3: scores[14],
      Item4: scores[15],
      Item5: scores[16],
    };
    console.log(sumFirst13, additionalResponses);
    return { sumFirst13, ...additionalResponses };
  };
  // Función principal que maneja el cálculo de puntuaciones basado en el testId
  const calculateTotalScore = (testId, scores, questions) => {
    switch (testId) {
      // case "1":
      //   return calculateSDQ_CAS(scores, questions);
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        return calculateSumOfScores(scores);
      case "8":
        return calculateBeckDesesperanza(scores);
      case "9":
        return calculateSalamanca(scores);
      case "10":
        return calculateMDQScore(scores);
      default:
        throw new Error(`Test ID ${testId} no reconocido`);
    }
  };
  
  export default calculateTotalScore;
  