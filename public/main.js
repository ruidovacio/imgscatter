const form = document.getElementById("form");
const image = document.getElementById("imageSource");
const result = document.getElementById("result");
let canUpload = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let style = "";
  if (canUpload) {
    const gridSize = document.getElementById("grid").value;
    try {
      style = document.querySelector(
        'input[type="radio"][name="style"]:checked'
      ).value;
    } catch (err) {
      style = undefined;
    }
    const checkboxes = form.querySelectorAll(
      'input[type="checkbox"][name="options"]'
    );
    const url = `/scatter?grid=${gridSize}&style=${style}&repeat=${checkboxes[0].checked}`;
    const imageFile = event.target.elements.imageSource.files[0];
    scatterImage(imageFile, url);
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

grid.addEventListener("change", (event) => {
  const newValue = event.target.value;
  document.getElementById("gridtext").innerHTML = `grid size: ${newValue}x${newValue}`;
});

async function scatterImage(imageFile, url) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await fetch(`${url}`, {
    method: "POST",
    body: formData,
  });
  const data = await response.text();
  const createdImage = document.createElement("img");
  createdImage.src = data;
  createdImage.classList.add("resultimage");
  result.innerHTML = "";
  result.appendChild(createdImage);
}
