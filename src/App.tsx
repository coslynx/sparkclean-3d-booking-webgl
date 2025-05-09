// src/App.tsx
 /**
  * Purpose: Defines the main application component, routing and layout structure.
  * Author: AI Assistant
  * Creation Date: June 27, 2024
  * Last Modification Date: June 27, 2024
  */
 

 import React, { Suspense } from 'react';
 import { BrowserRouter, Route, Routes } from 'react-router-dom';
 import HomePage from './pages/HomePage';
 import Header from './components/layout/Header';
 import Footer from './components/layout/Footer';
 import MinimalLayout from './components/layout/MinimalLayout';
 

 /**
  * ErrorBoundary Component
  * A class component that catches JavaScript errors anywhere in their child component tree,
  * logs those errors, and displays a fallback UI instead of the component tree that crashed.
  */
 class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
  super(props);
  this.state = { hasError: false };
  }
 

  static getDerivedStateFromError() {
  // Update state so the next render will show the fallback UI.
  return { hasError: true };
  }
 

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // You can also log the error to an error reporting service
  console.error('Caught error: ', error, errorInfo);
  }
 

  render() {
  if (this.state.hasError) {
  // You could render any custom fallback UI
  return (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  <h2 className="text-2xl font-semibold text-red-500 mb-4">Something went wrong.</h2>
  <p className="text-gray-700">Please try again later.</p>
  </div>
  );
  }
 

  return this.props.children;
  }
 }
 

 /**
  * Main App Component
  * Serves as the root component for the cleaning service application.
  * It configures routing and layout using React Router and Tailwind CSS.
  */
 function App() {
  return (
  <BrowserRouter>
  <ErrorBoundary>
  <MinimalLayout>
  <Header/>
  <Suspense fallback={<div className="text-center">Loading...</div>}>
  <Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="*" element={<div className="text-center">404 - Not Found</div>}/>
  </Routes>
  </Suspense>
  <Footer/>
  </MinimalLayout>
  </ErrorBoundary>
  </BrowserRouter>
  );
 }
 

 export default App;