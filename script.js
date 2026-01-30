// State: remaining seconds, interval id, running flag
let remaining = 25 * 60, intervalId = null, running = false;
const display = document.getElementById('display');
const message = document.getElementById('message');
const durationSelect = document.getElementById('duration');
const customTimeWrap = document.getElementById('custom-time-wrap');
const customMinutesInput = document.getElementById('custom-minutes');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function formatTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateDisplay() { display.textContent = formatTime(remaining); }

function getDurationMinutes() {
  const val = durationSelect.value;
  if (val === 'custom') {
    const n = parseInt(customMinutesInput.value, 10);
    if (isNaN(n) || n < 1) return 1;
    if (n > 120) return 120;
    return n;
  }
  return parseInt(val, 10);
}

function setDurationFromSelection() {
  remaining = getDurationMinutes() * 60;
  updateDisplay();
}

function showCustomTime(show) {
  customTimeWrap.classList.toggle('visible', show);
  customTimeWrap.setAttribute('aria-hidden', !show);
  if (show) customMinutesInput.focus();
}

function stopTimer() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  durationSelect.disabled = false;
  customMinutesInput.disabled = false;
}

function playBeep() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = new C();
    const playTone = (startAt) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.25, startAt);
      gain.gain.exponentialRampToValueAtTime(0.01, startAt + 0.25);
      osc.start(startAt);
      osc.stop(startAt + 0.25);
    };
    playTone(ctx.currentTime);
    playTone(ctx.currentTime + 0.3);
    playTone(ctx.currentTime + 0.6);
  } catch (_) {}
}

function tick() {
  if (remaining <= 0) {
    stopTimer();
    message.textContent = "Time's up!";
    playBeep();
    return;
  }
  remaining--;
  updateDisplay();
}

startBtn.onclick = function () {
  if (running) return;
  message.textContent = '';
  running = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  durationSelect.disabled = true;
  customMinutesInput.disabled = true;
  intervalId = setInterval(tick, 1000);
};

pauseBtn.onclick = stopTimer;

resetBtn.onclick = function () {
  stopTimer();
  message.textContent = '';
  setDurationFromSelection();
};

durationSelect.onchange = function () {
  const isCustom = durationSelect.value === 'custom';
  showCustomTime(isCustom);
  if (!running) {
    setDurationFromSelection();
    message.textContent = '';
  }
};

customMinutesInput.addEventListener('change', function () {
  let n = parseInt(this.value, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 120) n = 120;
  this.value = n;
  if (!running) {
    setDurationFromSelection();
    message.textContent = '';
  }
});

customMinutesInput.addEventListener('input', function () {
  if (!running && durationSelect.value === 'custom') {
    const n = parseInt(this.value, 10);
    if (!isNaN(n) && n >= 1 && n <= 120) {
      remaining = n * 60;
      updateDisplay();
    }
  }
});

// Show/hide custom input based on initial selection
showCustomTime(durationSelect.value === 'custom');
updateDisplay();
