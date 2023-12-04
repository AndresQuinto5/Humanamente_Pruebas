import emailjs from '@emailjs/browser';

export const sendEmailResults = (results, resetAppCallback) => {
    const templateParams = {
      testName2: 'Inventario de Depresión de Beck II',
      testScore2: typeof results['2'] === 'object' ? JSON.stringify(results['2']) : results['2'],
      testName3: 'Inventario de Ansiedad de Beck',
      testScore3: results['3'],
      testName4: 'Tamizaje de probióticos',
      testScore4: results['4'],
      testName5: 'Cuestionario de adherencia a la dieta mediterránea',
      testScore5: results['5'],
      testName6: 'Tamizaje vitamina D',
      testScore6: results['6'],
      testName8: 'Inventario de desesperanza de BECK',
      testScore8: JSON.stringify(results['8']),
      testName9: 'Cuestionario Salamanca de Trastornos de la Personalidad',
      testScore9: JSON.stringify(results['9']),
      testName10: 'Cuestionario de Trastornos del humor',
      testScore10: JSON.stringify(results['10']),
      userName: results.formulario.nombre,
      userLastName: results.formulario.Apellido,
      userBirthdate: results.formulario.fechaNacimiento,
      userEmail: results.formulario.email,
      userReferrer: results.formulario.referente,
      userAge: results.formulario.edadActual,
      userChronologicalAge: results.formulario.edadCronologica,
    };

  emailjs.send('service_olt7vkp', 'template_2m4f22t', templateParams, 'lnP-HAATjvaBg4IzL')
    .then(response => {
      console.log('SUCCESS!', response.status, response.text);
    //   alert('Resultados enviados correctamente!');
      resetAppCallback(); // Llama a la función de restablecimiento pasada como callback
    }, error => {
      console.log('FAILED...', error);
      alert('Error al enviar los resultados. Inténtalo de nuevo.');
    });
};
