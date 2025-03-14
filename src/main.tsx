
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set the initial theme class on the document before rendering
const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
document.documentElement.classList.add(savedTheme);

// Add dashboard-area class if on a dashboard route
if (window.location.pathname.match(/^\/(dashboard|courses|profile|admin)/)) {
  document.documentElement.classList.add('dashboard-area');
}

createRoot(document.getElementById("root")!).render(<App />);
