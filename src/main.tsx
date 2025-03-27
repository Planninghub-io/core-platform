
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Find the DOM root
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a function to initialize tracking if needed
const initializeTracking = () => {
  // This function would be called only when needed
  // You can add any initialization code for tracking/analytics here
  console.log('Tracking initialized on user interaction');
};

// Defer non-critical operations
const deferredInit = () => {
  // Initialize tracking on user interaction to avoid unnecessary network requests
  document.addEventListener('click', initializeTracking, { once: true });
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
  window.addEventListener('load', deferredInit);
}
