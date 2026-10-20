import { useState, useEffect, useRef } from 'react';
import IngestForm from './components/IngestForm';
import ItemList from './components/ItemList';
import QueryPanel from './components/QueryPanel';
import AnswerDisplay from './components/AnswerDisplay';

// Defaults to Light Mode unless the user previously clicked the toggle
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs === 'dark';
    }
  }
  return false; // Always default to white/light mode
};

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState(null);
  const [isDark, setIsDark] = useState(getInitialTheme);
  
  // Ref for auto-scrolling to the answer
  const resultRef = useRef(null);

  // Sync state to the DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Auto-scroll when a new result arrives
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen py-10 px-4 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header with Theme Toggle */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Turium RAG</h1>
            <p className="text-gray-500 dark:text-gray-400">Save notes. Ask questions. Get cited answers.</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
            title="Toggle Theme"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
        </header>
        
        <IngestForm onIngested={() => setRefresh(r => r + 1)} />
        <ItemList refresh={refresh} />
        
        <div className="pt-8 border-t border-gray-300 dark:border-gray-700">
          <QueryPanel onResult={setResult} />
          
          {/* Auto-scroll target */}
          <div ref={resultRef}>
            {result && <AnswerDisplay result={result} />}
          </div>
        </div>
      </div>
    </div>
  );
}