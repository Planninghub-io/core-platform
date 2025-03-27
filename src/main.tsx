
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Find the DOM root
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create tracking flags to avoid duplicate initialization
const trackingState = {
  initialized: false,
  pendingEvents: []
};

// Detect if we're in production or not
const isProduction = window.location.hostname !== 'localhost';

// Only initialize tracking on deliberate user interaction
const initializeTracking = () => {
  // Skip if already initialized or not in production
  if (trackingState.initialized || !isProduction) return;
  
  // Mark as initialized to prevent duplicate calls
  trackingState.initialized = true;
  
  // Any additional tracking initialization can go here
  // We're primarily relying on the deferred Facebook Pixel in index.html
  
  // Process any pending events that were captured before initialization
  while (trackingState.pendingEvents.length > 0) {
    const event = trackingState.pendingEvents.shift();
    if (event && typeof event === 'function') {
      try {
        event();
      } catch (e) {
        // Silently fail individual events rather than breaking the app
      }
    }
  }
};

// Set up the delayed initialization only in production
const setupDeferredTracking = () => {
  if (!isProduction) return;
  
  // Use passive listeners to not impact performance
  document.addEventListener('click', function() {
    // Use requestIdleCallback for even better performance when available
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeTracking);
    } else {
      setTimeout(initializeTracking, 50);
    }
  }, { once: true, passive: true });
  
  document.addEventListener('scroll', function() {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeTracking);
    } else {
      setTimeout(initializeTracking, 50);
    }
  }, { once: true, passive: true });
};

// Create and render the app
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Defer tracking setup until after app has rendered
if (document.readyState === 'complete') {
  setTimeout(setupDeferredTracking, 1000);
} else {
  window.addEventListener('load', function() {
    setTimeout(setupDeferredTracking, 1000);
  });
}
