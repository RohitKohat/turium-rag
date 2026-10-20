import { useState } from 'react';
import { query } from '../api/client';

export default function QueryPanel({ onResult }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await query(question);
      onResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4">Ask Questions</h2>
      {error && <div className="text-red-500 mb-4 text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          className="border border-gray-300 dark:border-gray-600 bg-transparent p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
          placeholder="Ask something about your saved notes..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all duration-200 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Thinking...
            </>
          ) : 'Ask'}
        </button>
      </form>
    </div>
  );
}