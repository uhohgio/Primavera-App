// core_functions.js

export const addProperty = (newProperty, setProperties, properties, setNewProperty) => {
  const { address, tenant, rent } = newProperty;
  if (!address || !tenant || !rent) {
    return alert('Fill in all fields');
  }
  setProperties([...properties, { address, tenant, rent }]);
  setNewProperty({ address: '', tenant: '', rent: '' });
};

export const deleteProperty = (index, setProperties, properties, setEditIndex) => {
  const updated = [...properties];
  updated.splice(index, 1);
  setProperties(updated);
  // Optional: If you want to stop editing if the deleted item was being edited
  setEditIndex(null);
};

export const startEdit = (index, properties, setEditIndex, setEditForm) => {
  setEditIndex(index);
  setEditForm({ ...properties[index] });
};

export const cancelEdit = (setEditIndex, setEditForm) => {
  setEditIndex(null);
  setEditForm({ address: '', tenant: '', rent: '' });
};

export const saveEdit = (index, editForm, setProperties, properties, setEditIndex, setEditForm) => {
  const updated = [...properties];
  updated[index] = { ...editForm };
  setProperties(updated);
  setEditIndex(null);
  setEditForm({ address: '', tenant: '', rent: '' });
};

export const handleChange = (e, setForm, form) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};