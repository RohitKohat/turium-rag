import { useState } from 'react';
import { ingest } from '../api/client';

export default function IngestForm({ onIngested }) {
  const [type, setType] = useState('note');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await ingest(type === 'note' ? { type, content } : { type, url });
      setContent(''); setUrl('');
      onIngested();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4">Add Content</h2>
      {error && <div className="text-red-500 mb-4 text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</div>}
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={type === 'note'} onChange={() => setType('note')} className="accent-blue-600" />
          Text Note
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={type === 'url'} onChange={() => setType('url')} className="accent-blue-600" />
          URL
        </label>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {type === 'note' ? (
          <textarea
            className="border border-gray-300 dark:border-gray-600 bg-transparent p-3 rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
            placeholder="Paste your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        ) : (
          <input
            type="url"
            className="border border-gray-300 dark:border-gray-600 bg-transparent p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all duration-200"
        >
          {loading ? 'Processing...' : 'Save & Embed'}
        </button>
      </form>
    </div>
  );
}