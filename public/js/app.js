let checkboxes = document.querySelectorAll('#checkbox');
let btnDelete = document.querySelector('#delete');

function checkCheckboxes() {
  let anyChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
  btnDelete.disabled = !anyChecked; // Aktifkan button jika ada yang dicentang
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', checkCheckboxes);
});
