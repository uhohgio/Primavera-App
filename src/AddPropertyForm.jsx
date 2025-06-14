import { useState } from 'react';


function AddPropertyForm({ onAdd, onCloseForm }) {
  const [form, setForm] = useState({ address: '', tenant: '', rent: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address || !form.tenant || !form.rent) return alert('Fill in all fields');

    await onAdd({
        address: form.address,
        tenant: form.tenant,
        rent: parseFloat(form.rent),
    });
    onCloseForm(); // Close the form after adding
    
    setForm({ address: '', tenant: '', rent: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} id="add-form" className="p-4 border rounded mb-4">
      <h2 className="text-lg font-semibold mb-2">Add New Property</h2>
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="tenant"
        placeholder="Tenant"
        value={form.tenant}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="rent"
        placeholder="Rent"
        value={form.rent}
        onChange={handleChange}
        required
      />
      <div style={{display:'grid',gridTemplateColumns: 'repeat(2, 1fr)', gap:'20px'}}><button
        type="submit"
      >
        Add Property
      </button> 
      <button
        onClick={onCloseForm}
      >Cancel</button></div>
        
    </form>
  );
}



export default AddPropertyForm;
