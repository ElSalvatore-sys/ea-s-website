import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config'; // Import synchronously to ensure it initializes first

console.log('[main.tsx] Starting application...');

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[main.tsx] FATAL: Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">Error: Root element not found. Please check the HTML.</h1>';
} else {
  console.log('[main.tsx] Root element found, creating React root...');

  try {
    // Create root and render - i18n is now initialized synchronously
    const root = createRoot(rootElement);

    console.log('[main.tsx] Rendering App component...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    console.log('[main.tsx] App component rendered successfully');
  } catch (error) {
    console.error('[main.tsx] Failed to render app:', error);

    // Show error in UI
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #ff0000; color: white; font-family: monospace;">
        <h1>Application Failed to Start</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}