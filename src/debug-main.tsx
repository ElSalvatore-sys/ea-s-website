// Debug version of main.tsx to identify the issue
console.log('=== DEBUG MAIN.TSX STARTING ===');

// Check if we're in a browser environment
if (typeof window === 'undefined') {
  console.error('Not in a browser environment!');
} else {
  console.log('✓ Browser environment detected');
}

// Check for root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<h1 style="color: red;">Root element not found!</h1>';
} else {
  console.log('✓ Root element found:', rootElement);

  // Try a simple render without i18n first
  try {
    console.log('Attempting simple React render...');

    import('react').then(React => {
      console.log('✓ React imported');

      import('react-dom/client').then(ReactDOM => {
        console.log('✓ ReactDOM imported');

        const root = ReactDOM.createRoot(rootElement);
        const TestComponent = React.createElement(
          'div',
          { style: { padding: '20px', background: '#1a1a1a', color: '#fff' } },
          React.createElement('h1', null, 'React is working!'),
          React.createElement('p', null, 'If you see this, React mounted successfully.'),
          React.createElement('p', null, 'Time: ' + new Date().toLocaleTimeString())
        );

        root.render(TestComponent);
        console.log('✓ Test component rendered');

        // Now try to load the actual app after a delay
        setTimeout(() => {
          console.log('Loading actual app...');
          import('./App').then(module => {
            const App = module.default;
            console.log('✓ App component imported');

            // Try rendering without i18n wrapper first
            try {
              root.render(React.createElement(App));
              console.log('✓ App rendered successfully');
            } catch (appError) {
              console.error('❌ Error rendering App:', appError);
            }
          }).catch(err => {
            console.error('❌ Failed to import App:', err);
          });
        }, 2000);

      }).catch(err => {
        console.error('❌ Failed to import ReactDOM:', err);
      });
    }).catch(err => {
      console.error('❌ Failed to import React:', err);
    });

  } catch (error) {
    console.error('❌ Error during render attempt:', error);
    rootElement.innerHTML = `<pre style="color: red;">Error: ${error}</pre>`;
  }
}

console.log('=== DEBUG MAIN.TSX COMPLETED ===');

export {};