import { useEffect, useState } from 'react';
import AddPropertyForm from './AddPropertyForm';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);


  if (loading) return <p>Loading...</p>;

  const fetchProperties = () => {
    fetch('http://localhost:3001/api/properties')
      .then((res) => res.json())
      .then(setProperties)
      .catch((err) => console.error('Error fetching:', err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyAdded = (newProp) => {
    setProperties((prev) => [...prev, newProp]);
  };

  const handlePropertyUpdated = (updatedProp) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProp.id ? updatedProp : p))
    );
  };

  const handleSave = async (id, updatedData) => {
    const res = await fetch(`http://localhost:3001/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
    //   const updatedProp = await res.json();
      handlePropertyUpdated({ id, ...updatedData });
    } else {
      console.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this property?");
  if (!confirm) return;

  const res = await fetch(`http://localhost:3001/api/properties/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  } else {
    console.error("Failed to delete property.");
  }
};


  return (
    <div className="max-w-xl mx-auto mt-6">
      <AddPropertyForm onPropertyAdded={handlePropertyAdded} />
      <h2 className="text-xl font-bold mb-4">Properties</h2>
      <ul>
        {properties.map((prop) => (
          <EditablePropertyItem
            key={prop.id}
            property={prop}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

function EditablePropertyItem({ property, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({ ...property });
  const [message, setMessage] = useState('');
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
        await onSave(property.id, {
            ...edited, rent: parseFloat(edited.rent) 
        });
        setMessage('✅ Saved!');
        setTimeout(() => setMessage(''), 3000);
        setIsEditing(false);
    } catch (err) {
        setMessage('❌ Failed to save.');
        setTimeout(() => setMessage(''), 3000);
        console.error(err);
    }
    
  };

  const handleCancelClick = () => {
  setEdited({ ...property }); // reset to original
  setIsEditing(false);
};


  return (
    <li className="mb-3 p-3 border rounded">
      {isEditing ? (
        <div className="space-y-2">
          <input
            name="address"
            value={edited.address}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
          <input
            name="tenant"
            value={edited.tenant}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
          <input
            name="rent"
            type="number"
            value={edited.rent}
            onChange={handleChange}
            className="w-full p-1 border rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
                onClick={handleSaveClick}
                className="bg-green-600 text-white px-3 py-1 rounded"
            >
                Save
            </button>
            <button
                onClick={handleCancelClick}
                className="bg-gray-400 text-white px-3 py-1 rounded"
            >
                Cancel
            </button>
          </div>
          {message && <p className="text-sm mt-1 text-green-600">{message}</p>}
        </div>
        
      ) : (
        <div>
          <strong>{property.address}</strong><br />
          Tenant: {property.tenant}<br />
          Rent: ${property.rent}
          <div className="mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(property.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )
      
      }
      
    </li>
  );
}
export default PropertyList;
