
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log("SmartMenu yuklanmoqda: React 18.3.1");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Kritik xato: HTML ichida #root elementi topilmadi.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React render muvaffaqiyatli bajarildi.");
  } catch (error) {
    console.error("Render jarayonida xatolik yuz berdi:", error);
  }
}
