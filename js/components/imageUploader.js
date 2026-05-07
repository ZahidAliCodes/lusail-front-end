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