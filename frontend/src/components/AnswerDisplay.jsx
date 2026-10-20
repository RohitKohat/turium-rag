import { useState } from 'react';
import SourceCard from './SourceCard';

export default function AnswerDisplay({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6 animate-slide-up transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Answer</h2>
        <button 
          onClick={handleCopy}
          className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded transition-colors"
        >
          {copied ? '✅ Copied!' : '📋 Copy Answer'}
        </button>
      </div>
      
      <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-6 leading-relaxed">
        {result.answer}
      </div>
      
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 border-t border-gray-200 dark:border-gray-700 pt-4">Sources</h3>
      <div className="space-y-3">
        {result.sources.map(s => (
          <SourceCard key={s.index} {...s} />
        ))}
      </div>
    </div>
  );
}