
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Find the DOM root
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a function to initialize tracking if needed
const initializeTracking = () => {
  // Only run in production environment
  if (process.env.NODE_ENV !== 'production') return;
  
  // This is a hook for any additional tracking initialization
  // We're now relying on the Facebook pixel implementation in index.html
  // which avoids making any network requests until user interaction
};

// Defer non-critical operations
const deferredInit = () => {
  // Initialize tracking on user interaction, but only in production
  if (process.env.NODE_ENV === 'production') {
    // We need more than one event to ensure tracking is initialized
    // if the user interacts in different ways
    document.addEventListener('click', initializeTracking, { once: true });
    document.addEventListener('scroll', initializeTracking, { once: true });
  }
};

// Create and render the app
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Wait for the app to be fully rendered before attaching additional listeners
if (document.readyState === 'complete') {
  deferredInit();
} else {
  window.addEventListener('load', deferredInit, { once: true });
}
