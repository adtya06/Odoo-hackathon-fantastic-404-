// Simple test to verify contexts
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './src/context/AuthContext';
import { DarkModeProvider } from './src/context/DarkModeContext';

// Simple test component
const TestComponent = () => {
  return (
    <div>
      <h1>Context Test</h1>
      <p>If you see this, contexts are working!</p>
    </div>
  );
};

// Test the provider setup
const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </DarkModeProvider>
  );
};

// Try to render
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
