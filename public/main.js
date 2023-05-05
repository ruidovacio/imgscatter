const form = document.getElementById("form");
const image = document.getElementById("image");
let canUpload = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (canUpload) {
    const gridSize = document.getElementById("grid").value;
    const style = document.querySelector('input[type="radio"][name="style"]:checked').value;
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="options"]');
    form.action = `/scatter?grid=${gridSize}&style=${style}&repeat=${checkboxes[0].checked}`;
    console.log(form.action);
    form.submit();
  }
});

image.addEventListener("change", (event) => {
  const selectedFile = event.target.files[0];
  const mensaje = document.getElementById("warning");

  if (selectedFile.size > 1000000) {
    mensaje.style.display = "block";
    canUpload = false;
  } else {
    mensaje.style.display = "none";
    canUpload = true;
  }
});
