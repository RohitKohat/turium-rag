
const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed');
  }
  
  return data;
}

export const ingest = (body) => req('/ingest', { method: 'POST', body: JSON.stringify(body) });
export const getItems = () => req('/items');
export const query = (q) => req('/query', { method: 'POST', body: JSON.stringify({ question: q }) });
export const getRelated = (id) => req(`/related/${id}`);