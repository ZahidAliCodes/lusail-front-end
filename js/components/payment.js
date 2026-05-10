const paymentSelectionArea = document.getElementById("paymentSelectionArea");

const lcscCheckbox = document.getElementById("lcscCheckbox");
const rulesCheckbox = document.getElementById("rulesCheckbox");

const submitPaymentBtn = document.querySelector(".process-payment-btn");

const paymentModal = document.getElementById("paymentSuccessModal");
const closePaymentModal = document.getElementById("closePaymentModal");


/* =========================
   SHOW PAYMENT AREA
========================= */


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
   ESC KEY CLOSE MODAL
========================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        paymentModal?.classList.remove("active");
    }
});

// ELEMENTS
const payNowTrigger = document.getElementById("payNowTrigger");
const paymentPopup = document.getElementById("paymentPopup");
const closePaymentPopup = document.getElementById("closePaymentPopup");

// OPEN POPUP
payNowTrigger.addEventListener("click", () => {
    paymentPopup.classList.add("active");
    document.body.classList.add("popup-open");
});

// CLOSE POPUP
closePaymentPopup.addEventListener("click", () => {
    paymentPopup.classList.remove("active");
    document.body.classList.remove("popup-open");
});

// OUTSIDE CLICK CLOSE
paymentPopup.addEventListener("click", (e) => {
    if (e.target === paymentPopup) {
        paymentPopup.classList.remove("active");
        document.body.classList.remove("popup-open");
    }
});

// ESC CLOSE
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        paymentPopup.classList.remove("active");
        document.body.classList.remove("popup-open");
    }
});
