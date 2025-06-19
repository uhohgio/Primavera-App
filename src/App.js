import { useState, useEffect, useCallback } from 'react';
import AddPropertyForm from './AddPropertyForm';
import PropertyCard from './PropertyCard';
import { supabase } from './supabaseClient';

function App({user}) {
  const [properties, setProperties] = useState([]);
  const[loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);


  // Fetch properties from Supabase

  const fetchProperties = useCallback((async () => {
    setLoading(true); // Set loading to true before fetching
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id); // Fetch only properties for the logged-in user

    if (error) {
      console.error('Error fetching properties:', error);
      setProperties([]); // Ensure fallback to empty array
    } else {
      setProperties(data);
    }
    setLoading(false); // Set loading to false after fetching
  }), [user.id]);

  useEffect(() => {
    if (user && user.id) {
      fetchProperties();
    }
  }, [fetchProperties, user]);

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
      .insert([newProp])
      .select(); // get the inserted data back

    if (error) throw error;

    if (!data || data.length === 0) return;
    setProperties((prev) => [...prev, ...data]);

    setShowAddForm(false); // closes form after adding

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
      .eq('property_id', id)
      .select(); // get the updated data back;

    

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No data returned on update');
      return;
    }

    setProperties((prev) =>
      prev.map((p) => (p.property_id === id ? data[0] : p))
    );
    
    // alert('Property updated successfully!'); // if you wanna see a more tangible response
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
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((p) => (
                  <PropertyCard
                    key={p.property_id}
                    property={p}
                    onDelete={() => handleDelete(p.property_id)}
                    onSave={handleSave}
                  />
                ))
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px'}}>
              <h3 style={{marginBottom: '5px'}}>
                Click the plus sign to start adding new properties!
              </h3>
              <p style={{marginTop: '5px'}}>
                <span style={{ fontSize: '0.9em'}}>
                  (Refresh if you can't see ones you have already added.)
                </span>
              </p>
              </div>
            )}
          </div>
    
  );
}
 
export default App;

