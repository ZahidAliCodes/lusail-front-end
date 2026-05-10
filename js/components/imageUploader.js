document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("imageUpload");
  const profileImg = document.getElementById("profileDisplay");

  if (!input || !profileImg) return;

  input.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        profileImg.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  });
});

document.querySelectorAll(".u-nexus-upload-container").forEach((container) => {
  const dropZone = container.querySelector(".u-nexus-dropzone");
  const fileInput = container.querySelector(".u-nexus-file-input");
  const fileListContainer = container.querySelector(".u-nexus-file-list");
  const uploadBtn = container.querySelector(".u-nexus-upload-btn");

  let selectedFiles = [];

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  dropZone.addEventListener("dragover", () => {
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    dropZone.classList.remove("dragover");

    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      selectedFiles.push(file);
    });

    renderFileList();

    fileInput.value = "";
  }

  function renderFileList() {
    fileListContainer.innerHTML = "";

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();

      const item = document.createElement("div");

      item.className = "u-nexus-file-item";

      reader.onload = (e) => {
        item.innerHTML = `
                    <button class="u-nexus-remove-btn">×</button>
                    <img src="${e.target.result}" alt="preview">
                    <div class="u-nexus-file-name">${file.name}</div>
                `;

        item
          .querySelector(".u-nexus-remove-btn")
          .addEventListener("click", () => {
            selectedFiles.splice(index, 1);

            renderFileList();
          });
      };

      reader.readAsDataURL(file);

      fileListContainer.appendChild(item);
    });
  }
});

const addVehicleBtn = document.getElementById("addVehicleBtn");
const vehiclePopup = document.getElementById("vehiclePopup");
const closeVehiclePopup = document.getElementById("closeVehiclePopup");

// OPEN POPUP
addVehicleBtn.addEventListener("click", () => {
    vehiclePopup.classList.add("active");
    document.body.classList.add("popup-open");
});

// CLOSE POPUP
closeVehiclePopup.addEventListener("click", () => {
    vehiclePopup.classList.remove("active");
    document.body.classList.remove("popup-open");
});

// CLOSE ON OUTSIDE CLICK
vehiclePopup.addEventListener("click", (e) => {
    if (e.target === vehiclePopup) {
        vehiclePopup.classList.remove("active");
        document.body.classList.remove("popup-open");
    }
});
