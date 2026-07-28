/* =========================================================
   Purba Badkulla Burima Baroyari — site behaviour
   Edit the CONFIG block below to update dates, UPI id, etc.
   ========================================================= */

const CONFIG = {
  // Countdown target: set to your Mahalaya / Shashthi date & time
  pujaDate: new Date('2026-10-16T06:00:00+05:30'),
  upiId: 'burimabaroyari@upi',
};

// One entry per Journey year. `images` is empty until you have real
// photos for that edition — the lightbox shows a "coming soon" note
// automatically whenever the array is empty.
const JOURNEY_DATA = {
  2026: { tag: 'Current Edition',  images: [] },
  2025: {
    tag: 'The Grand Return',
    images: [
      { src: 'attachments/hero.jpg', caption: 'Sandhikkhon at the mandap' },
      { src: 'attachments/xyz.jpeg', caption: 'Maa Durga — a reflection' },
      { src: 'attachments/pandal.jpeg',caption:'The heaven'},
    ],
  },
  2024: { tag: 'Lights of Faith', images: [ {src: 'attachments/2023.jpeg', caption: 'Sacred Aura'},
    {src: 'attachments/2023i.jpeg',caption:'Heaven On Earth'},
    {src: 'attachments/2023j.jpeg',caption:'Wrapped In Divinity'},] },
  2023: { tag: 'Roots & Rhythm',  images: [] },
};

/* ---------- Nav: scroll shadow + mobile toggle ---------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Countdown ---------- */
function updateCountdown() {
  const now = new Date();
  let diff = CONFIG.pujaDate - now;
  if (diff < 0) diff = 0;

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins  = Math.floor((diff / (1000 * 60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent  = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent  = pad(mins);
  document.getElementById('cd-secs').textContent  = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- Journey year lightbox ---------- */
const lightbox      = document.getElementById('yearLightbox');
const lightboxYear   = document.getElementById('lightboxYear');
const lightboxTag    = document.getElementById('lightboxTag');
const lightboxBody   = document.getElementById('lightboxBody');
const lightboxClose  = document.getElementById('lightboxClose');

function openYearLightbox(year) {
  const data = JOURNEY_DATA[year];
  if (!data) return;

  lightboxYear.textContent = year;
  lightboxTag.textContent = data.tag;

  if (data.images.length) {
    lightboxBody.innerHTML = `<div class="lightbox-images">${
      data.images.map(img => `
        <figure>
          <img src="${img.src}" alt="${img.caption}">
          <figcaption>${img.caption}</figcaption>
        </figure>
      `).join('')
    }</div>`;
  } else {
    lightboxBody.innerHTML = `<p class="lightbox-empty">More memories will be added soon.</p>`;
  }

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeYearLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.journey-card').forEach(card => {
  card.addEventListener('click', () => openYearLightbox(card.dataset.year));
});
lightboxClose.addEventListener('click', closeYearLightbox);
lightbox.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeYearLightbox));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeYearLightbox();
});

/* ---------- Copy UPI id ---------- */
const copyBtn = document.getElementById('copyUpi');
const upiInput = document.getElementById('upiId');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(upiInput.value);
  } catch (e) {
    upiInput.select();
    document.execCommand('copy');
  }
  copyBtn.textContent = 'Copied';
  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
  }, 1600);
});

/* ---------- Stat count-up ---------- */
function animateStat(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Scroll reveal (also triggers stat count-up) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateStat);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats').forEach(el => statsObserver.observe(el));

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- QR code placeholder ----------
   This draws a QR-LOOKING pattern for layout purposes only —
   it is NOT scannable. Swap it for a real UPI QR before launch:
   e.g. generate one at https://upiqr.in or with the "qrcode"
   npm package, save as assets/upi-qr.png, and replace the <svg>
   in index.html with <img src="assets/upi-qr.png" alt="UPI QR">.
------------------------------------------------------------ */
(function drawFakeQR() {
  const svg = document.getElementById('qrCode');
  const size = 21; // grid cells
  const cell = 200 / size;
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const cells = [];
  for (let y = 0; y < size; y++) {
    cells.push([]);
    for (let x = 0; x < size; x++) cells[y].push(rand() > 0.55 ? 1 : 0);
  }

  // stamp the three finder squares like a real QR code
  function finder(cx, cy) {
    for (let y = -3; y <= 3; y++) {
      for (let x = -3; x <= 3; x++) {
        const gx = cx + x, gy = cy + y;
        if (gx < 0 || gy < 0 || gx >= size || gy >= size) continue;
        const ring = Math.max(Math.abs(x), Math.abs(y));
        cells[gy][gx] = (ring === 3 || ring === 1) ? 0 : 1;
      }
    }
  }
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);

  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (cells[y][x]) {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#0b0705"/>`;
      }
    }
  }
  svg.innerHTML = `<rect width="200" height="200" fill="#f3ece0"/>${rects}`;
})();
