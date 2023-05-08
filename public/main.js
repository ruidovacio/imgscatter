const form = document.getElementById("form");
const image = document.getElementById("imageSource");
const result = document.getElementById("result");
let canUpload = false;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (canUpload) {
    const gridSize = document.getElementById("grid").value;
    const style = document.querySelector(
      'input[type="radio"][name="style"]:checked'
    ).value;
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

async function scatterImage(imageFile, url) {
  // const blob = await imageFile.blob();
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await fetch(`${url}`, {
    method: "POST",
    body: formData,
  });
  const parsedImage = await response.blob();
  const parsedURL = URL.createObjectURL(parsedImage);

  const imageElement = document.createElement("img");
  const sourceElement = document.createElement("source");

  imageElement.src = parsedURL;
  imageElement.classList.add("resultimage")
  sourceElement.srcset = parsedURL;
  sourceElement.type = "image/webp";

  result.innerHTML = "";
  result.appendChild(imageElement);
}
