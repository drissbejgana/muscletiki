import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import MyContextProvider from "./contexts/MyContextProvider.tsx";
import { LanguageProvider } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </LanguageProvider>
);
