const payNowTrigger = document.getElementById("payNowTrigger");
const paymentSelectionArea = document.getElementById("paymentSelectionArea");

const lcscCheckbox = document.getElementById("lcscCheckbox");
const rulesCheckbox = document.getElementById("rulesCheckbox");

const submitPaymentBtn = document.querySelector(".process-payment-btn");

const paymentModal = document.getElementById("paymentSuccessModal");
const closePaymentModal = document.getElementById("closePaymentModal");
const goEventsBtn = document.getElementById("goEventsBtn");

/* =========================
   SHOW PAYMENT AREA
========================= */

if (payNowTrigger) {
    payNowTrigger.addEventListener("click", function () {

        if (!lcscCheckbox.checked || !rulesCheckbox.checked) {
            alert("Please agree to all Terms and Conditions to proceed.");
            return;
        }

        paymentSelectionArea.style.display = "block";
        this.style.display = "none";
    });
}

/* =========================
   PAYMENT METHOD SWITCH
========================= */

const methodRows = document.querySelectorAll(".payment-method-row");

methodRows.forEach((row) => {

    row.addEventListener("click", function () {

        methodRows.forEach((r) => r.classList.remove("active"));

        this.classList.add("active");

        const radio = this.querySelector(".method-radio-input");
        if (radio) radio.checked = true;
    });

});

/* =========================
   SUBMIT PAYMENT -> OPEN MODAL
========================= */

if (submitPaymentBtn) {
    submitPaymentBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const activeMethod = document.querySelector(".payment-method-row.active");

        if (!activeMethod) {
            alert("Please select a payment method");
            return;
        }

        const inputs = activeMethod.querySelectorAll("input[type='text']");

        let isValid = true;

        inputs.forEach((input) => {

            if (input.value.trim() === "") {
                isValid = false;
                input.style.border = "1px solid red";
            } else {
                input.style.border = "";
            }

        });

        if (!isValid) {
            alert("Please fill all payment fields");
            return;
        }

        /* OPEN MODAL */
        if (paymentModal) {
            paymentModal.classList.add("active");
        }
    });
}

/* =========================
   CLOSE MODAL BUTTON
========================= */

if (closePaymentModal) {
    closePaymentModal.addEventListener("click", () => {
        paymentModal.classList.remove("active");
    });
}

/* =========================
   CLOSE MODAL ON OUTSIDE CLICK
========================= */

if (paymentModal) {
    paymentModal.addEventListener("click", (e) => {

        if (e.target === paymentModal) {
            paymentModal.classList.remove("active");
        }

    });
}

/* =========================
   GO TO EVENTS
========================= */

if (goEventsBtn) {
    goEventsBtn.addEventListener("click", () => {
        window.location.href = "summary.html";
    });
}

/* =========================
   ESC KEY CLOSE MODAL
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        paymentModal?.classList.remove("active");
    }
});