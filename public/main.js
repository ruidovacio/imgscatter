const form = document.getElementById("form");
const image = document.getElementById("image");
const checkboxes = form.querySelectorAll('input[type="checkbox"][name="options"]');
let canUpload = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (canUpload) {
    const gridSize = document.getElementById("grid").value;
    form.action = `/scatter?grid=${gridSize}&repeat=${checkboxes[0].checked}&color=${checkboxes[1].checked}`;
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
