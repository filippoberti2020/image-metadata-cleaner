const uploadInput = document.getElementById("image-upload");
const imageContainer = document.getElementById("image-container");
const downloadButton = document.getElementById("download-button");

let imageList = [];

uploadInput.addEventListener("change", () => {
  const files = uploadInput.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const image = {
          file: file,
          url: event.target.result,
          canvas: canvas,
        };
        imageList.push(image);
        displayImage(image);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function displayImage(image) {
  const div = document.createElement("div");
  div.classList.add("image");
  div.innerHTML = `
    <img src="${image.url}" alt="${image.file.name}">
    <button class="remove-button" onclick="removeImage('${image.file.name}')">X</button>
  `;
  imageContainer.appendChild(div);
}

function removeImage(name) {
  imageList = imageList.filter((image) => image.file.name !== name);
  imageContainer.innerHTML = "";
  for (let i = 0; i < imageList.length; i++) {
    displayImage(imageList[i]);
  }
}

downloadButton.addEventListener("click", () => {
  for (let i = 0; i < imageList.length; i++) {
    const image = imageList[i];
    const a = document.createElement("a");
    a.href = image.canvas.toDataURL();
    a.download = image.file.name;
    a.click();
  }
});
