import { createContext } from 'react';

const MyContext = createContext({
  advanced: false,
  updateAdvanced: () => {},
});

export default MyContext;