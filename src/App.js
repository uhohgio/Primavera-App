import { useState, useEffect } from 'react';
import AddPropertyForm from './AddPropertyForm';
import PropertyCard from './PropertyCard';
import { supabase } from './supabaseClient';

function App({user}) {
  const [properties, setProperties] = useState([]);
  const[loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  console.log(user); // Supabase user object


  // Fetch properties from Supabase

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

  if (loading) return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <p>Loading...</p>
    </div>
  );


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
      .eq('property_id', id);

    if (error) throw error;

    setProperties((prev) => prev.filter((p) => p.property_id !== id));
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
      .eq('property_id', id);
    alert('Property updated successfully!');
    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No data returned on update');
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.property_id === id ? data[0] : p))
    );
    
    await fetchProperties(); // 👈 refresh after add
  } catch (err) {
    console.error('Error saving property:', err);
  }
};


  return (
          <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🏠 Primavera Property Manager 🏠</h1>
            {showAddForm && (
                <AddPropertyForm onAdd={handleAdd} onCloseForm={() => setShowAddForm(false)} user={user} />
            )}
            

            <div id="property-cards-title"><h3 >Properties</h3><button id="open-add-property-btn" onClick={() => setShowAddForm(true)}>&#43;</button></div>
            {Array.isArray(properties) && properties.some((p) => p.user_id === user.id) ? (
              properties.map((p) => {
                if (p.user_id !== user.id) return null;
                return (
                  // Ensure only user's properties are shown
                  <PropertyCard
                    key={p.property_id}
                    property={p}
                    onDelete={() => handleDelete(p.property_id)}
                    onSave={handleSave}
                  />
                );
              })
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px'}}>
              <h3 style={{marginBottom: '5px'}}>Click the plus sign to start adding new properties!</h3>
              <p style={{marginTop: '5px'}}><span style={{ fontSize: '0.9em'}}>(Refresh if you can't see ones you have already added.)</span></p>
              </div>
            )}
          </div>
    
  );
}
 
export default App;

