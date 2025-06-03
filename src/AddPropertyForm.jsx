import { useState } from 'react';


function AddPropertyForm({ onAdd }) {
  const [form, setForm] = useState({ address: '', tenant: '', rent: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const { address, tenant, rent } = form;
    if (!address || !tenant || !rent) return alert('Fill in all fields');
    onAdd({ address, tenant, rent });
    setForm({ address: '', tenant: '', rent: '' });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form,
        rent: parseFloat(form.rent)
      })
    });
    
    const newProperty = await res.json();
    handleAdd(newProperty); // Update parent list
    setForm({ address: '', tenant: '', rent: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h2 className="text-lg font-semibold mb-2">Add New Property</h2>
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="block mb-2 p-2 border rounded w-full"
        required
      />
      <input
        type="text"
        name="tenant"
        placeholder="Tenant"
        value={form.tenant}
        onChange={handleChange}
        className="block mb-2 p-2 border rounded w-full"
        required
      />
      <input
        type="number"
        name="rent"
        placeholder="Rent"
        value={form.rent}
        onChange={handleChange}
        className="block mb-2 p-2 border rounded w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Property
      </button>
    </form>
  );
}

export default AddPropertyForm;

//   return (
//     <div>
//       <h3>Add New Property</h3>
//       <input name="address" value={form.address} onChange={handleChange} placeholder="Address" /><br />
//       <input name="tenant" value={form.tenant} onChange={handleChange} placeholder="Tenant Name" /><br />
//       <input name="rent" type="number" value={form.rent} onChange={handleChange} placeholder="Monthly Rent" /><br />
//       <button onClick={handleAdd}>Add Property</button>
//     </div>
//   );
// }

// export default AddPropertyForm;
