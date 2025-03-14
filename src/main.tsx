
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set the initial theme class on the document before rendering
const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
document.documentElement.classList.add(savedTheme);

createRoot(document.getElementById("root")!).render(<App />);
