import { useState } from 'react';

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
    // setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log('Saving with data:', editForm); // debug output

    if (!editForm.address || !editForm.tenant || isNaN(editForm.rent)) {
      alert('Please fill out all fields correctly.');
      return;
    }

    // await onSave(property.id, editForm);
    setIsEditing(false);
//     console.log('Saving:', {
//         address: editForm.address,
//         tenant: editForm.tenant,
//         rent: editForm.rent
//         });

  await onSave(property.id, {
    address: editForm.address,
    tenant: editForm.tenant,
    rent: parseFloat(editForm.rent)
  });
  setIsEditing(false);
};

//   const handleCancel = () => {
//     setEditForm({
//       address: property.address || '',
//       tenant: property.tenant || '',
//       rent: property.rent || 0,
//     });
//     setIsEditing(false);
//   };


  return (
    <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '6px' }}>
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
          <button onClick={() => onDelete(property.id)} style={{ marginLeft: '10px' }}>Delete</button>
        </>
      )}
    </div>
  );
}

export default PropertyCard;
