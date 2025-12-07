import React, { useState, useMemo } from 'react';
import MyContext from './MyContext';

const MyContextProvider = ({ children }) => {
  const [advanced, setAdvanced] = useState(false);

  const updateAdvanced = (newValue) => {
    setAdvanced(newValue);
  };

  const contextValue = useMemo(() => ({
    advanced,       
    updateAdvanced, 
  }), [advanced]);

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;