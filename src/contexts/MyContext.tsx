import { createContext } from 'react';

interface MyContextType {
  advanced: boolean;
  homme: boolean;
  articulations: boolean;
  updateAdvanced: (value: boolean) => void;
  updateHomme: (value: boolean) => void;
  updateArticulations: (value: boolean) => void;
}

// Create context with proper typing
const MyContext = createContext<MyContextType>({
  advanced: false,
  homme: false,
  articulations: false,
  updateAdvanced: () => {},
  updateHomme: () => {},
  updateArticulations: () => {},
});


export default MyContext;