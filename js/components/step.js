// ===============================
// ELEMENTS
// ===============================
const step1Nav = document.getElementById('step1Nav');
const step2Nav = document.getElementById('step2Nav');
const content1 = document.getElementById('contentStep1');
const content2 = document.getElementById('contentStep2');

const otpModal = document.getElementById('otpModal');
const displayEmail = document.getElementById('displayEmail');

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', setDefaultState);

function setDefaultState() {
    step1Nav.classList.add('active');
    step1Nav.classList.remove('inactive');

    step2Nav.classList.remove('active');
    step2Nav.classList.add('inactive');

    content1.classList.add('active');
    content2.classList.remove('active');

    const firstEvent = document.querySelector('.event-item');
    if (firstEvent) {
        document.querySelectorAll('.event-item').forEach(i => i.classList.remove('active'));
        firstEvent.classList.add('active');
    }
}

// ===============================
// EVENT SELECTION
// ===============================
document.querySelectorAll('.event-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.event-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===============================
// STEP SWITCHING
// ===============================
step2Nav.addEventListener('click', showStep2);
step1Nav.addEventListener('click', showStep1);

function showStep2() {
    step1Nav.classList.add('inactive');
    step1Nav.classList.remove('active');

    step2Nav.classList.add('active');
    step2Nav.classList.remove('inactive');

    content1.classList.remove('active');
    content2.classList.add('active');
}

function showStep1() {
    step1Nav.classList.add('active');
    step1Nav.classList.remove('inactive');

    step2Nav.classList.remove('active');
    step2Nav.classList.add('inactive');

    content2.classList.remove('active');
    content1.classList.add('active');
}

// ===============================
// FORM SUBMIT VALIDATION
// ===============================
document.querySelector('.submission-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput');
    const phone = document.querySelector('input[type="tel"]');
    const password = document.querySelectorAll('.password-wrapper input')[0];
    const confirmPassword = document.querySelectorAll('.password-wrapper input')[1];

    let isValid = true;

    // reset errors
    [email, phone, password, confirmPassword].forEach(input => {
        input.classList.remove('error');
    });

    // empty validation
    [email, phone, password, confirmPassword].forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        }
    });

    if (!isValid) return;

    // email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        email.classList.add('error');
        return;
    }

    // password match validation
    if (password.value !== confirmPassword.value) {
        password.classList.add('error');
        confirmPassword.classList.add('error');
        alert("Passwords do not match!");
        return;
    }

    // OPEN OTP MODAL
    displayEmail.textContent = email.value;
    otpModal.style.display = 'flex';
});

// ===============================
// MODAL CLOSE
// ===============================
document.getElementById('btnCloseModal').addEventListener('click', () => {
    otpModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === otpModal) {
        otpModal.style.display = 'none';
    }
});

// ===============================
// OTP VERIFY
// ===============================
document.getElementById('btnVerify').addEventListener('click', () => {
    const otpInputs = document.querySelectorAll('#otpInputs input');

    let otpValue = '';
    let isValid = true;

    otpInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
            otpValue += input.value;
        }
    });

    if (!isValid) return;

    console.log("OTP:", otpValue);

    otpModal.style.display = 'none';

    // optional redirect
    location.reload();
});

// ===============================
// OTP AUTO FOCUS
// ===============================
const otpInputs = document.querySelectorAll('#otpInputs input');

otpInputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {

        if (e.key >= '0' && e.key <= '9') {
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        }

        if (e.key === 'Backspace') {
            if (index > 0 && !input.value) {
                otpInputs[index - 1].focus();
            }
        }
    });
});

// ===============================
// PASSWORD TOGGLE
// ===============================
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});




// step 2 
const dropZone = document.getElementById('u-nexus-dropzone');
const fileInput = document.getElementById('u-nexus-file-input');
const fileListContainer = document.getElementById('u-nexus-file-list');

let selectedFiles = []; // Files track karne ke liye array

// Drag & Drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
  dropZone.addEventListener(e, (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  });
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', function() {
  handleFiles(this.files);
});

function handleFiles(files) {
  const filesArray = Array.from(files);
  
  filesArray.forEach(file => {
    // Sirf images handle karne ke liye
    if (!file.type.startsWith('image/')) return;
    
    selectedFiles.push(file);
    renderFileList();
  });

  // CRITICAL: Input ko empty karna taake same file dubara upload ho sakay
  fileInput.value = ""; 
}

function renderFileList() {
  fileListContainer.innerHTML = "";
  
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    const item = document.createElement('div');
    item.className = 'u-nexus-file-item';

    reader.onload = (e) => {
      item.innerHTML = `
        <button class="u-nexus-remove-btn" onclick="removeFile(${index})">×</button>
        <img src="${e.target.result}" alt="preview">
        <div class="u-nexus-file-name">${file.name}</div>
      `;
    };
    
    reader.readAsDataURL(file);
    fileListContainer.appendChild(item);
  });
}

// File delete karne ka function
window.removeFile = function(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
};