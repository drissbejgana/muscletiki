import React, { useState, useMemo } from 'react';
import MyContext from './MyContext';

const MyContextProvider = ({ children }) => {
const [advanced, setAdvanced] = useState(false);
  const [homme, setHomme] = useState(false);
  const [articulations, setArticulations] = useState(false);


  return (
    <MyContext.Provider  value={{ 
        advanced, 
        homme, 
        articulations,
        updateAdvanced: setAdvanced,
        updateHomme: setHomme,
        updateArticulations: setArticulations
      }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;