const addButton = document.getElementById("open-add-property-btn");
const form = document.getElementById('add-form');
addButton.addEventListener('click', () => {
  form.classList.toggle('hidden');
});
