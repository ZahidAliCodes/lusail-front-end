// =========================
// Universal Include Function
// =========================
function includeHTML(id, fileName, callback) {
    fetch(fileName)
        .then(response => {
            if (!response.ok) throw new Error(`${fileName} load nahi ho saki.`);
            return response.text();
        })
        .then(data => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = data;
                if (callback) callback(); // run AFTER load
            }
        })
        .catch(err => console.warn("Include Error:", err));
}

// =========================
// Language Loader
// =========================
async function loadLocale(locale) {
    try {
        const res = await fetch(`/locales/${locale}.json`);
        const translations = await res.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                const firstTextNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
                if (firstTextNode) {
                    firstTextNode.textContent = translations[key] + " ";
                } else {
                    el.textContent = translations[key];
                }
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                el.setAttribute('placeholder', translations[key]);
            }
        });

        document.body.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    } catch (err) {
        console.error('Error loading translations:', err);
    }
}

// =========================
// Header JS
// =========================
function initHeaderJS() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const bars = mobileToggle.querySelectorAll('span');
            const isOpen = navLinks.classList.contains('show');
            if (bars.length >= 3) {
                bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,6px)' : 'none';
                bars[1].style.opacity = isOpen ? '0' : '1';
                bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-6px)' : 'none';
            }
        });
    }

    const submenuLinks = document.querySelectorAll('.has-submenu');
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = link.nextElementSibling;
            const icon = link.querySelector('i');
            if (!submenu) return;
            document.querySelectorAll('.submenu').forEach(sm => { if (sm !== submenu) sm.style.display = 'none'; });
            document.querySelectorAll('.has-submenu i').forEach(ic => { if (ic !== icon) ic.style.transform = 'rotate(0deg)'; });
            const isOpen = submenu.style.display === 'flex';
            submenu.style.display = isOpen ? 'none' : 'flex';
            submenu.style.flexDirection = 'column';
            if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links')) {
            document.querySelectorAll('.submenu').forEach(sm => { sm.style.display = 'none'; });
            document.querySelectorAll('.has-submenu i').forEach(ic => { ic.style.transform = 'rotate(0deg)'; });
        }
    });

    const langSelectors = document.querySelectorAll('.lang-selector');
    langSelectors.forEach(selector => {
        const currentLang = selector.querySelector('.currentLang');
        const flagImg = selector.querySelector('.flagImg');
        if (!currentLang || !flagImg) return;
        currentLang.textContent = 'AR';
        flagImg.src = '../assets/images/qa.svg';

        selector.addEventListener('click', () => {
            if (body.classList.contains('rtl')) {
                body.classList.remove('rtl');
                updateAllLangSelectors('AR', '../assets/images/qa.svg');
                location.reload();
            } else {
                body.classList.add('rtl');
                updateAllLangSelectors('EN', '../assets/images/us.svg');
                if (typeof loadLocale === 'function') loadLocale('ar');
            }
        });
    });

    function updateAllLangSelectors(text, flagSrc) {
        document.querySelectorAll('.lang-selector').forEach(sel => {
            const txt = sel.querySelector('.currentLang');
            const img = sel.querySelector('.flagImg');
            if (txt) txt.textContent = text;
            if (img) img.src = flagSrc;
        });
    }

    wireNavEventsLinks();
    wireSupportNavLink();
    wireHomeNavLink();
    syncHeaderNavActive();
}

/** Home → index.html path from root or ../index.html from /pages/ */
function wireHomeNavLink() {
    const a = document.querySelector('#navLinks > li > a[data-nav="home"]');
    if (!a) return;
    const inPages = window.location.pathname.includes('/pages/');
    a.href = inPages ? '../index.html' : 'index.html';
}

/** Header SUPPORT → pages/support.html from index, support.html from /pages/ */
function wireSupportNavLink() {
    const a = document.querySelector('a.nav-support-link');
    if (!a) return;
    const inPages = window.location.pathname.includes('/pages/');
    a.href = inPages ? 'support.html' : 'pages/support.html';
}

/** Header ADULTS / KIDS → index + hash; corrected when in /pages/ */
function wireNavEventsLinks() {
    const links = document.querySelectorAll('a.nav-events-link');
    if (!links.length) return;
    const inPages = window.location.pathname.includes('/pages/');
    const base = inPages ? '../index.html' : 'index.html';
    links.forEach((a) => {
        const which = a.getAttribute('data-events');
        const hash = which === 'kids' ? '#events-kids' : '#events-adults';
        a.href = base + hash;
    });
}

/** Forgot password page: in-card success state after submit. */
function initForgotPasswordDemo() {
    const form = document.getElementById('forgot-password-form');
    const initial = document.getElementById('forgotPasswordInitial');
    const success = document.getElementById('forgotPasswordSuccess');
    const notice = document.getElementById('forgotPasswordNotice');
    const emailOut = document.getElementById('forgotSentToEmail');
    if (!form || !initial || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('forgot-email');
        const email = input?.value?.trim() || '';
        if (!email) return;
        if (emailOut) emailOut.textContent = email;
        initial.hidden = true;
        success.hidden = false;
        if (notice) notice.hidden = true;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

function initRegistrationLogic() {
    const step2Form = document.querySelector('#contentStep2 form');
    const otpModal = document.getElementById('otpModal');
    const otpCard = document.getElementById('otpCard');

    if (step2Form) {
        step2Form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            if (otpModal && otpCard) {
                // Modal show karein
                otpModal.style.display = 'flex';

                // Naya content load karein jo aapki purani CSS classes use karega
                otpCard.innerHTML = `
                    <span class="close-icon" onclick="document.getElementById('otpModal').style.display='none'">
                         <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15" stroke="white" stroke-opacity="0.6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 5L15 15" stroke="white" stroke-opacity="0.6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                         </svg>
                    </span>
                    
                    <div class="otp-lock" style="background:transparent; margin-bottom: 20px;">
                        <!-- Aapka diya hua Green Success SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <g clip-path="url(#clip0_207_14120)">
                                <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#26F0D2"/>
                                <path d="M40.0004 20.3625C39.8441 29.2297 33.9137 36.6906 25.8105 39.1438L14.4043 27.7375L31.3918 11.7578L40.0004 20.3625Z" fill="url(#paint0_linear_207_14120)"/>
                                <path d="M32.1877 13.6805C32.1881 14.0375 32.118 14.391 31.9814 14.7209C31.8448 15.0507 31.6443 15.3502 31.3916 15.6024L18.7502 28.243C18.4978 28.4955 18.1981 28.6958 17.8683 28.8325C17.5385 28.9691 17.185 29.0394 16.8279 29.0394C16.4709 29.0394 16.1174 28.9691 15.7876 28.8325C15.4577 28.6958 15.1581 28.4955 14.9057 28.243L8.60802 21.9461C8.34987 21.695 8.1442 21.395 8.00295 21.0637C7.8617 20.7324 7.78769 20.3763 7.78522 20.0161C7.78275 19.656 7.85187 19.2989 7.98855 18.9657C8.12524 18.6325 8.32678 18.3297 8.58146 18.075C8.83614 17.8204 9.13888 17.6188 9.47211 17.4821C9.80533 17.3454 10.1624 17.2763 10.5226 17.2788C10.8827 17.2813 11.2388 17.3553 11.5701 17.4965C11.9014 17.6378 12.2014 17.8434 12.4525 18.1016L16.8275 22.4766L27.5471 11.7586C27.9273 11.3786 28.4116 11.1199 28.9389 11.0151C29.4661 10.9103 30.0126 10.9641 30.5092 11.1698C31.0059 11.3755 31.4304 11.7238 31.7291 12.1706C32.0279 12.6175 32.1875 13.1429 32.1877 13.6805Z" fill="white"/>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_207_14120" x1="22.641" y1="19.4914" x2="35.7168" y2="32.5672" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#1AB39C"/>
                                    <stop offset="1" stop-color="#26F0D2" stop-opacity="0"/>
                                </linearGradient>
                                <clipPath id="clip0_207_14120">
                                    <rect width="40" height="40" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <h2 style="font-weight: 800; text-transform: uppercase;">Registration Successful!</h2>
                    
                    <p style="margin-bottom: 30px; opacity: 0.8;">
                        Your registration is confirmed successfully.<br>
                        Get ready for an exciting experience on track.
                    </p>
                    
                    <button class="verify-btn" onclick="location.reload()" style="background: #26F0D2; color: #1c237e;">
                        Continue
                    </button>
                `;
                
                // Screenshot 2026-05-01 at 3.02.45 AM.png ke mutabiq box ka background blue set karein
                otpCard.style.background = "#3b43a9"; 
            }
        });
    }
}
// =========================
// Initialization
// =========================
document.addEventListener('DOMContentLoaded', () => {
    initHeaderJS();
    initRegistrationLogic(); // Start OTP flow

    includeHTML('header-container', '../components/header.html', initHeaderJS);
    includeHTML('footer-container', '../components/footer.html');

    // Country Select / Flag Logic
    const selects = document.querySelectorAll('.country-select');
    const flags = { "+974": "qa", "+966": "sa", "+971": "ae", "+965": "kw" };

    selects.forEach(select => {
        const wrapper = select.closest('.custom-select');
        if (!wrapper) return;
        const flagImg = wrapper.querySelector('.prefix-flag img');
        const icon = wrapper.querySelector('.chevron');

        select.addEventListener('change', (e) => {
            const triggerText = wrapper.querySelector('.prefix-text');
            if (triggerText) triggerText.textContent = e.target.options[e.target.selectedIndex].text;
            if (flagImg && flags[e.target.value]) flagImg.src = `https://flagcdn.com/w20/${flags[e.target.value]}.png`;
            wrapper.classList.add('has-value');
            icon?.classList.remove('rotate');
        });
        select.addEventListener('focus', () => icon?.classList.add('rotate'));
        select.addEventListener('blur', () => icon?.classList.remove('rotate'));
    });

    // DOB Logic
    const yearSelect = document.getElementById("yearSelect");
    const monthSelect = document.getElementById("monthSelect");
    const daySelect = document.getElementById("daySelect");

    if (yearSelect && monthSelect && daySelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= currentYear - 100; y--) {
            const opt = document.createElement("option");
            opt.value = y; opt.textContent = y;
            yearSelect.appendChild(opt);
        }

        const updateDays = () => {
            const y = yearSelect.value, m = monthSelect.value;
            if (!y || !m) return;
            const daysInMonth = new Date(y, m, 0).getDate();
            daySelect.innerHTML = '<option value="" disabled selected>Select Date</option>';
            for (let d = 1; d <= daysInMonth; d++) {
                const opt = document.createElement("option");
                opt.value = d; opt.textContent = d;
                daySelect.appendChild(opt);
            }
        };
        yearSelect.addEventListener("change", updateDays);
        monthSelect.addEventListener("change", updateDays);
    }

    // Phone Toggle Logic
    document.querySelectorAll('.toggle-phone').forEach(icon => {
        icon.addEventListener('click', function () {
            const input = document.getElementById(this.dataset.target);
            if (!input) return;
            const isHidden = input.dataset.hidden === "true";
            if (!isHidden) {
                input.dataset.realValue = input.value;
                input.value = input.value.replace(/./g, "•");
                input.dataset.hidden = "true";
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.value = input.dataset.realValue || "";
                input.dataset.hidden = "false";
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    ensureNavEventsDelegation();
    if (document.body.classList.contains('home')) {
        applyEventsHashFromLocation();
    }

    initForgotPasswordDemo();
});



// step js — Adults / Kids event grids + URL hash (#events-adults / #events-kids)
function setEventsAudience(isKids) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const adultsGrid = document.querySelector('.event-grid-adults');
  const kidsGrid = document.querySelector('.event-grid-kids');
  if (!adultsGrid || !kidsGrid) return;
  tabBtns.forEach((b) => {
    const label = b.querySelector('span')?.textContent.trim() || '';
    const isKidsTab = label === 'KIDS';
    b.classList.toggle('active', isKids ? isKidsTab : !isKidsTab);
  });
  adultsGrid.hidden = isKids;
  kidsGrid.hidden = !isKids;
}

function applyEventsHashFromLocation() {
  if (document.body.classList.contains('home')) {
    const hash = window.location.hash.slice(1);
    if (hash === 'events-kids') setEventsAudience(true);
    else if (hash === 'events-adults') setEventsAudience(false);
  }
  syncHeaderNavActive();
}

let navEventsDelegationWired = false;
function ensureNavEventsDelegation() {
  if (navEventsDelegationWired) return;
  navEventsDelegationWired = true;

  window.addEventListener('hashchange', () => {
    applyEventsHashFromLocation();
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.nav-events-link');
    if (!a || !document.body.classList.contains('home')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const isKids = a.getAttribute('data-events') === 'kids';
    setEventsAudience(isKids);
    const hash = isKids ? '#events-kids' : '#events-adults';
    history.replaceState(null, '', hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks')?.classList.remove('show');
    syncHeaderNavActive();
  });
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const label = btn.querySelector('span')?.textContent.trim() || '';
    const isKids = label === 'KIDS';
    setEventsAudience(isKids);
    if (document.body.classList.contains('home')) {
      history.replaceState(null, '', isKids ? '#events-kids' : '#events-adults');
    }
    syncHeaderNavActive();
  });
});

/** Aktif menü çizgisi: URL + hash’e göre Home / Adults / Kids / Support */
function syncHeaderNavActive() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  nav.querySelectorAll(':scope > li > a[data-nav]').forEach((a) => {
    a.classList.remove('active');
  });

  const path = window.location.pathname || '';
  const hash = window.location.hash.replace(/^#/, '');

  let key = 'home';
  if (path.includes('support.html')) key = 'support';
  else if (
    path.includes('login.html') ||
    path.includes('register.html') ||
    path.includes('forgot-password.html')
  ) {
    key = null;
  } else if (document.body.classList.contains('home')) {
    if (hash === 'events-kids') key = 'kids';
    else if (hash === 'events-adults') key = 'adults';
    else key = 'home';
  }

  if (!key) return;
  const active = nav.querySelector(`:scope > li > a[data-nav="${key}"]`);
  if (active) active.classList.add('active');
}


function goToStep(stepNumber, el = null) {
  document.querySelectorAll('.step-event').forEach(s => {
    s.classList.remove('active');
  });

  const target = document.getElementById('step-' + stepNumber);
  if (target) {
    target.classList.add('active');
  }

  // =========================
  // STEP 2 DYNAMIC DATA
  // =========================
  if (stepNumber === 2 && el) {
    const title = el.getAttribute('data-title');
    const img = el.getAttribute('data-img');

    const titleEl = document.getElementById('selectedEventTitle');
    const imgEl = document.getElementById('selectedEventImg');

    if (titleEl) titleEl.textContent = title;
    if (imgEl) imgEl.src = img;
  }
}


function showPaymentSuccess() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}


const lkDays = document.querySelectorAll('.lk-day');

lkDays.forEach(day => {
  if (!day.classList.contains('lk-disabled')) {
    day.addEventListener('click', () => {

      document.querySelector('.lk-active')?.classList.remove('lk-active');
      day.classList.add('lk-active');

      // optional step navigation
      // goToStep(4);

    });
  }
});