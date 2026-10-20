import { useState, useEffect } from 'react';
import { getItems, getRelated } from '../api/client';

export default function ItemList({ refresh }) {
  const [items, setItems] = useState([]);
  const [related, setRelated] = useState({});
  const [loadingRelated, setLoadingRelated] = useState({});

  useEffect(() => {
    getItems().then(data => setItems(data.items)).catch(console.error);
  }, [refresh]);

  const handleShowRelated = async (id) => {
    if (related[id]) return;
    setLoadingRelated(prev => ({ ...prev, [id]: true }));
    try {
      const data = await getRelated(id);
      setRelated(prev => ({ ...prev, [id]: data.related }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRelated(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4">Saved Items ({items.length})</h2>
      {items.length === 0 && <p className="text-gray-500 dark:text-gray-400">No items saved yet.</p>}
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                {item.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{item.preview}...</p>
            
            <div className="flex gap-2 mb-3 flex-wrap">
              {JSON.parse(item.tags || '[]').map((tag, i) => (
                <span key={i} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>

            <button 
              onClick={() => handleShowRelated(item.id)}
              disabled={loadingRelated[item.id]}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 transition-opacity"
            >
              {loadingRelated[item.id] ? 'Searching...' : 'Find Related Notes'}
            </button>

            {related[item.id] && (
              <div className="mt-3 text-sm bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg animate-fade-in">
                <strong className="block mb-1">Related Notes:</strong>
                {related[item.id].length === 0 && <span className="text-gray-500">No related items found.</span>}
                <ul className="list-disc pl-5 space-y-1">
                  {related[item.id].map(rel => (
                    <li key={rel.item_id} className="text-gray-600 dark:text-gray-400">
                      {rel.source || rel.type} <span className="text-xs opacity-75">(score: {rel.distance.toFixed(3)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}