import { useState, useEffect } from 'react';
import AddPropertyForm from './AddPropertyForm';
import PropertyCard from './PropertyCard';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetch('http://localhost:3001/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

const handleAdd = async (newProp) => {
  try {
    const res = await fetch('http://localhost:3001/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProp)
    });
    const saved = await res.json();
    setProperties((prev) => [...prev, saved]);
  } catch (err) {
    console.error('Failed to add property:', err);
  }
};


  const handleDelete = async (id) => {
  try {
    await fetch(`http://localhost:3001/api/properties/${id}`, {
      method: 'DELETE'
    });
    setProperties((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error('Failed to delete:', err);
  }
};
const handleSave = async (id, updatedProperty) => {
  try {
    console.log('Sending updatedProperty to API:', updatedProperty);

    const res = await fetch(`http://localhost:3001/api/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProperty), // must be stringified
    });

    if (!res.ok) throw new Error('Failed to update');
    const updated = await res.json();
    // update local state
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  } catch (err) {
    console.error('Error saving property:', err);
  }
};



  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏠 Property Manager</h1>
      <AddPropertyForm onAdd={handleAdd} />

      <h3>Properties</h3>
      {Array.isArray(properties) && properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          onDelete={() => handleDelete(p.id)}
          onSave={handleSave}
        />
      ))}

    </div>
  );
}

export default App;

