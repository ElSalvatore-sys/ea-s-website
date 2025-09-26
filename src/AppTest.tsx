import React from 'react';

function AppTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '48px' }}>React App is Working!</h1>
      <p style={{ color: '#666', fontSize: '24px' }}>
        If you can see this message, React is rendering correctly.
      </p>
      <p style={{ color: '#999', fontSize: '18px' }}>
        Current time: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

export default AppTest;