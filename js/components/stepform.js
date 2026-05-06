// ===============================
// STEP 1 → STEP 2 (EVENT SELECT)
// ===============================
window.goToStep = function (step, card) {
  if (step === 2) {
    const title = card.getAttribute("data-title");
    const img = card.getAttribute("data-img");

    localStorage.setItem(
      "selectedEvent",
      JSON.stringify({ title, img })
    );

    window.location.href = "pages/sessions.html";
  }
};


// ===============================
// STEP 2 → STEP 3 (SESSION → CALENDAR)
// ===============================
window.goToStep3 = function () {
  window.location.href = "calendar.html";
};


// ===============================
// STEP 3 → STEP 4 (CALENDAR → SLOTS)
// ===============================
window.goToSlot = function (el) {
  const date = el?.getAttribute("data-date");

  if (!date) return;

  localStorage.setItem(
    "selectedDate",
    JSON.stringify({ date })
  );

  window.location.href = "slots.html";
};


// ===============================
// STEP 4 → STEP 5 (SLOTS → SUMMARY)
// ===============================
window.goToSummary = function () {
  window.location.href = "summary.html";
};


// ===============================
// LOAD DATA ON ALL PAGES
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const eventData = JSON.parse(localStorage.getItem("selectedEvent"));
  const dateData = JSON.parse(localStorage.getItem("selectedDate"));

  if (!eventData) return;

  const imgPath =
    eventData.img?.startsWith("http") || eventData.img?.startsWith("../")
      ? eventData.img
      : "../" + eventData.img;


  // ===============================
  // STEP 2 (sessions.html)
  // ===============================
  const step2Title = document.getElementById("selectedEventTitle");
  const step2Img = document.getElementById("selectedEventImg");

  if (step2Title) step2Title.textContent = eventData.title;
  if (step2Img) step2Img.src = imgPath;


  // ===============================
  // STEP 3 (calendar.html)
  // ===============================
  const step3Title = document.getElementById("selectedEventTitleStep3");
  const step3Img = document.getElementById("selectedEventImgStep3");
  const step3Nav = document.getElementById("selectedEventTitleStep3Nav");

  if (step3Title) step3Title.textContent = eventData.title;
  if (step3Img) step3Img.src = imgPath;
  if (step3Nav) step3Nav.textContent = eventData.title;


  // ===============================
  // STEP 4 (slots.html)
  // ===============================
  const step4Title = document.getElementById("slotEventTitle");
  const step4Nav = document.getElementById("selectedEventTitleStep4Nav");
  const step4Date = document.getElementById("slotSelectedDate");

  if (step4Title) step4Title.textContent = eventData.title;
  if (step4Nav) step4Nav.textContent = eventData.title;

  if (step4Date && dateData) {
    let finalDate = dateData.date;

    if (!finalDate.includes("2026")) {
      finalDate += " 2026";
    }

    step4Date.textContent = finalDate;
  }


  // ===============================
  // STEP 5 (summary.html)
  // ===============================
  const summaryTitle = document.getElementById("summaryEventTitle");
  const summaryImg = document.getElementById("summaryEventImg");
  const summaryDate = document.getElementById("summaryEventDate");

  if (summaryTitle) summaryTitle.textContent = eventData.title;
  if (summaryImg) summaryImg.src = imgPath;

  if (summaryDate && dateData) {
    let finalDate = dateData.date;

    if (!finalDate.includes("2026")) {
      finalDate += " 2026";
    }

    summaryDate.textContent = finalDate;
  }

});


// ===============================
// BACK NAV
// ===============================
window.goBackToCalendar = function () {
  window.location.href = "calendar.html";
};