import { useState } from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ property, onDelete, onSave, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    address: property.address || '',
    tenant: property.tenant || '',
    rent: property.rent || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'rent' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
  console.log('Saving with data:', editForm); // debug output

  if (!editForm.address || !editForm.tenant || isNaN(editForm.rent)) {
      alert('Please fill out all fields correctly.');
      return;
  }

  setIsEditing(false);
  await onSave(property.property_id, {
    address: editForm.address,
    tenant: editForm.tenant,
    rent: parseFloat(editForm.rent)
  });
  setIsEditing(false);
};
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      onDelete(property.property_id);
    }
  }

  return (
    <div id="property-card" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '6px' }} >
      {isEditing ? (
        <>
          <input 
            name="address" 
            value={editForm.address} 
            onChange={handleChange} 
          />
          <br />
          <input 
            name="tenant" 
            value={editForm.tenant} 
            onChange={handleChange} 
          />
          <br />
          <input 
            name="rent" 
            type="number" 
            value={editForm.rent} 
            onChange={handleChange} 
          />
          <br />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{property.address}</strong><br />
          Tenant: {property.tenant}<br />
          Rent: ${property.rent}/month<br />
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
          <Link to={`/property/${property.property_id}`} style={{ textDecoration: 'none', color: 'inherit' }}><button style={{ marginLeft: '10px' }} >Manage Files</button></Link>
        </>
      )}
    </div>
  );
}

export default PropertyCard;
