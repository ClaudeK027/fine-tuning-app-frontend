// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Importez votre fournisseur de thème personnalisé
import { CustomThemeProvider } from './context/ThemeContext'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Utilisez votre fournisseur de thème personnalisé */}
    <CustomThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomThemeProvider>
  </React.StrictMode>,
);
