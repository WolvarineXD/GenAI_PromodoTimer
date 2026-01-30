// State: remaining seconds, interval id, running flag
let remaining = 25 * 60, intervalId = null, running = false;
const display = document.getElementById('display');
const message = document.getElementById('message');
const durationSelect = document.getElementById('duration');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

function formatTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function updateDisplay() { display.textContent = formatTime(remaining); }
function stopTimer() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  running = false;
}
function tick() {
  if (remaining <= 0) { stopTimer(); message.textContent = "Time's up!"; return; }
  remaining--;
  updateDisplay();
}

startBtn.onclick = function () {
  if (running) return;
  message.textContent = '';
  running = true;
  intervalId = setInterval(tick, 1000);
};
pauseBtn.onclick = stopTimer;
resetBtn.onclick = function () {
  stopTimer();
  message.textContent = '';
  remaining = parseInt(durationSelect.value, 10) * 60;
  updateDisplay();
};
// When duration changes while stopped, reset display to selected value
durationSelect.onchange = function () {
  if (!running) {
    remaining = parseInt(durationSelect.value, 10) * 60;
    updateDisplay();
    message.textContent = '';
  }
};
updateDisplay();
