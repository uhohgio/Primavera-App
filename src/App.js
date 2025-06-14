import { useState, useEffect } from 'react';
import AddPropertyForm from './AddPropertyForm';
import PropertyCard from './PropertyCard';
import { supabase } from './supabaseClient';

function App() {
  const [properties, setProperties] = useState([]);
  const[loading, setLoading] = useState(true);


  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      console.error('Error fetching properties:', error);
      setProperties([]); // Ensure fallback to empty array
    } else {
      setProperties(data);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) return <p>Loading...</p>;

const handleAdd = async (newProp) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([newProp]);

    if (error) throw error;
    if (!data || data.length === 0) return;
    setProperties((prev) => [...prev, ...data]);

    await fetchProperties(); // 👈 refresh after add
  } catch (err) {
    console.error('Failed to add property:', err);
  }
};

// Delete property
const handleDelete = async (id) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProperties((prev) => prev.filter((p) => p.id !== id));
    await fetchProperties(); // 👈 refresh after add
  } catch (err) {
    console.error('Failed to delete:', err);
  }
};

// Update property
const handleSave = async (id, updatedProperty) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(updatedProperty)
      .eq('id', id);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No data returned on update');
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? data[0] : p))
    );

    await fetchProperties(); // 👈 refresh after add
  } catch (err) {
    console.error('Error saving property:', err);
  }
};


  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏠 Property Manager</h1>
      <AddPropertyForm onAdd={handleAdd} />

      <h3>Properties</h3>
      {Array.isArray(properties) && properties.length > 0 ? (
      properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          onDelete={() => handleDelete(p.id)}
          onSave={handleSave}
        />
      ))
    ) : (
      <p>No properties added yet!</p> 
    )}
    </div>
  );
}

export default App;

