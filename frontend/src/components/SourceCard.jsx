import { useState } from 'react';

export default function SourceCard({ index, snippet, source, distance }) {
  const [showRaw, setShowRaw] = useState(false);

  // Distance is usually between 0 and 2 for cosine distance (lower is better)
  const score = distance ? (1 - (distance / 2)).toFixed(3) : 'N/A';

  return (
    <div id={`source-${index}`} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">[{index}]</span>
          {source}
        </div>
        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded font-mono" title="Cosine Similarity Score (1.0 is perfect match)">
          Match: {score}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 italic mb-2">"{snippet}..."</p>
      
      <button 
        onClick={() => setShowRaw(!showRaw)}
        className="text-xs text-blue-500 hover:underline"
      >
        {showRaw ? 'Hide Vector Metadata' : 'Inspect Vector Metadata'}
      </button>
      
      {showRaw && (
        <pre className="mt-2 p-2 bg-gray-800 text-green-400 text-xs rounded overflow-x-auto">
          {JSON.stringify({ chunk_index: index, source: source, cosine_distance: distance }, null, 2)}
        </pre>
      )}
    </div>
  );
}