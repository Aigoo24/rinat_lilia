// ===============================
// НАСТРОЙКИ САЙТА
// Меняйте данные ниже под конкретную свадьбу.
// ===============================
const SITE_CONFIG = {
  groomName: 'Ринат',
  brideName: 'Лилия',
  weddingDateISO: '2026-09-04T13:30:00+03:00',
  weddingDateText: '4 сентября 2026',

  // Вставьте сюда URL Google Apps Script после публикации Web App.
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbxC8A8zZKhlqX4L0sf2QoN7L8CN4IR5hF1zrlHavjIfjz3DsOsn10t0UcDsxIKkhz0tAw/exec'
};

const $ = (selector) => document.querySelector(selector);

function setText(selector, value) {
  const el = $(selector);
  if (el && value) el.textContent = value;
}

function initContent() {
  setText('#groomName', SITE_CONFIG.groomName);
  setText('#brideName', SITE_CONFIG.brideName);
  setText('#weddingDateText', SITE_CONFIG.weddingDateText);
  setText('#footerNames', `${SITE_CONFIG.groomName} & ${SITE_CONFIG.brideName}`);
  document.title = `${SITE_CONFIG.groomName} & ${SITE_CONFIG.brideName} — свадебное приглашение`;
}

function initCountdown() {
  const target = new Date(SITE_CONFIG.weddingDateISO).getTime();
  const daysEl = $('#days');
  const hoursEl = $('#hours');
  const minutesEl = $('#minutes');
  const secondsEl = $('#seconds');

  function update() {
    const diff = Math.max(target - Date.now(), 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

function initRevealAnimation() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function serializeForm(form) {
  const data = new FormData(form);
  data.append('sent_at', new Date().toLocaleString('ru-RU'));
  return data;
}

function initForm() {
  const form = $('#rsvpForm');
  const message = $('#formMessage');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.classList.remove('is-error');

    if (!SITE_CONFIG.googleScriptUrl) {
      message.textContent = 'Форма готова. Осталось вставить URL Google Apps Script в script.js.';
      message.classList.add('is-error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем...';
    message.textContent = '';

    try {
      await fetch(SITE_CONFIG.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: serializeForm(form)
      });

      form.reset();
      message.textContent = 'Спасибо! Ваш ответ отправлен.';
    } catch (error) {
      message.textContent = 'Не получилось отправить ответ. Попробуйте ещё раз или напишите нам напрямую.';
      message.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить ответ';
    }
  });
}

window.addEventListener('load', () => {
  $('#pageLoader')?.classList.add('is-hidden');
});

initContent();
initCountdown();
initRevealAnimation();
initForm();
