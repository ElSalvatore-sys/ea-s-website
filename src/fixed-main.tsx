import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('[FIXED-MAIN] Starting with i18n suspense disabled...');

// Clear any bad data first
try {
  const storageSize = new Blob(Object.values(localStorage)).size;
  if (storageSize > 500000) {
    console.log('[FIXED-MAIN] Clearing large localStorage...');
    localStorage.clear();
  }
} catch (e) {
  console.log('[FIXED-MAIN] Clearing storage due to error...');
  localStorage.clear();
  sessionStorage.clear();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">No root element found!</div>';
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('[FIXED-MAIN] App mounted successfully!');
  } catch (error) {
    console.error('[FIXED-MAIN] Failed to mount App:', error);
    document.body.innerHTML = `
      <div style="padding: 40px; text-align: center; background: #ff0040; color: white;">
        <h1>App Mount Error</h1>
        <p>${error.message}</p>
      </div>
    `;
  }
}