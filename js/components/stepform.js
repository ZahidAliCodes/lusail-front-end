// ===============================
// GLOBAL STATE
// ===============================
let selectedDate = "";

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
// STEP 3 → STEP 4 (CALENDAR CLICK)
// ===============================
window.goToSlot = function (el) {
  const date = el?.getAttribute("data-date");
  if (!date) return;

  // 1. Date save karein
  selectedDate = date;
  localStorage.setItem("selectedDate", JSON.stringify({ date }));

  // 2. Visual highlight (Selection color)
  document.querySelectorAll('.lk-day').forEach(day => day.classList.remove('lk-active'));
  el.classList.add('lk-active');

  // 3. Pehle Popup show karein (Next page nahi jayega)
  openKidsModal();
};

// ===============================
// OPEN KIDS MODAL
// ===============================
window.openKidsModal = function () {
  const modal = document.getElementById("kidsModal");
  if (modal) {
    modal.style.display = "flex"; // CSS check karein ke .lk-modal-overlay flex support kare
  } else {
    console.error("Modal ID 'kidsModal' nahi mila!");
  }
};

// ===============================
// CLOSE KIDS MODAL
// ===============================
window.closeKidsModal = function () {
  const modal = document.getElementById("kidsModal");
  if (modal) modal.style.display = "none";
};

// ===============================
// CONFIRM KID SELECTION → NEXT PAGE
// ===============================
window.confirmKidSelection = function () {
  const checked = document.querySelectorAll(
    "input[name='kid-select']:checked"
  );

  // Check agar koi bhi kid select nahi hai
  if (checked.length === 0) {
    alert("Please select at least one profile.");
    return;
  }

  // Selected kids ke naam save karein (Summary page ke liye)
  const selectedKids = [];
  checked.forEach(input => {
    const kidName = input.closest('tr').cells[1].textContent.trim();
    selectedKids.push(kidName);
  });
  localStorage.setItem("selectedKids", JSON.stringify(selectedKids));

  // Modal band karein
  closeKidsModal();

  // AB next page par jaye (Redirect)
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
  const kidsData = JSON.parse(localStorage.getItem("selectedKids"));

  if (!eventData) return;

  // Path resolution
  const imgPath =
    eventData.img?.startsWith("http") || eventData.img?.startsWith("../")
      ? eventData.img
      : "../" + eventData.img;

  // Har page par event title aur image update karein
  const titles = ["selectedEventTitle", "selectedEventTitleStep3", "selectedEventTitleStep3Nav", "slotEventTitle", "selectedEventTitleStep4Nav", "summaryEventTitle"];
  titles.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = eventData.title;
  });

  const imgs = ["selectedEventImg", "selectedEventImgStep3", "summaryEventImg"];
  imgs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = imgPath;
  });

  // Date fill karein (Slots & Summary page)
  const dateFields = ["slotSelectedDate", "summaryEventDate"];
  if (dateData) {
    let finalDate = dateData.date;
    if (!finalDate.includes("2026")) finalDate += " 2026";
    dateFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = finalDate;
    });
  }

  // Summary page par selected kids dikhayen
  const summaryKids = document.getElementById("summaryKidsList");
  if (summaryKids && kidsData) {
    summaryKids.textContent = kidsData.join(", ");
  }
});

// ===============================
// BACK NAV
// ===============================
window.goBackToCalendar = function () {
  window.location.href = "calendar.html";
};