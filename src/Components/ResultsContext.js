import React, { createContext, useContext, useState } from 'react';

const ResultsContext = createContext();

export const useResults = () => {
  return useContext(ResultsContext);
};

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState({});

  const addResult = (testId, result) => {
    setResults(prevResults => ({
      ...prevResults,
      [testId]: result,
    }));
  };

  return (
    <ResultsContext.Provider value={{ results, addResult }}>
      {children}
    </ResultsContext.Provider>
  );
};
