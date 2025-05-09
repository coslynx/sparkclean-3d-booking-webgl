// src/main.tsx
 /**
  * Purpose: Initializes the React application and mounts it to the DOM.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */
 

 import React from 'react';
 import ReactDOM from 'react-dom/client';
 import App from './App';
 import './styles/index.css';
 

 const rootElement = document.getElementById('root');
 

 if (!rootElement) {
  console.error('Root element with id "root" not found. Unable to initialize the application.');
 } else {
  try {
  ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
  <App/>
  </React.StrictMode>
  );
  } catch (error: any) {
  console.error('Failed to initialize the app:', error);
  }
 }