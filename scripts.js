
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const minusButton = document.getElementById('minus');
const plusButton = document.getElementById('plus');
const controls = document.querySelector('.controls');
const mainText = document.getElementById('main-text');
const tomatoImage = document.querySelector('.tomato');
const idleTomato = 'img/tomato1.png';
const tomatoFrames = [
    'img/tomato2.png',
    'img/tomato3.png',
    'img/tomato4.png',
    'img/tomato3.png',
];

let currentMinutes = parseInt(document.getElementById('time').innerHTML.split(':')[0]);
let remainingSeconds = currentMinutes * 60;
let deadline = null;
let intervalId = null;
let pressedButton = null;
let workingStartedAt = null;

function pressButton(button) {
    pressedButton = button;
    button.classList.add('is-pressed');
}

function releaseButton() {
    pressedButton?.classList.remove('is-pressed');
    pressedButton = null;
}

for (const button of [startButton, stopButton, minusButton, plusButton]) {
    button.addEventListener('pointerdown', (event) => {
        if (event.button === 0) {
            pressButton(button);
        }
    });

    button.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            pressButton(button);
        }
    });
}

window.addEventListener('pointerup', releaseButton);
window.addEventListener('pointercancel', releaseButton);
window.addEventListener('keyup', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        releaseButton();
    }
});
window.addEventListener('blur', releaseButton);

function changeTime(amount) {
    if (intervalId !== null) { return; }
    currentMinutes = currentMinutes + amount;
    if (currentMinutes < 5) {
        currentMinutes = 5;
    };
    if (currentMinutes > 60) {
        currentMinutes = 60;
    };
    remainingSeconds = currentMinutes * 60;
    displayTime();
}

function displayTime() {
    const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  timeDisplay.textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (intervalId !== null) return;

    if (remainingSeconds === 0) {
        remainingSeconds = currentMinutes * 60;
        displayTime();
    }

    deadline = Date.now() + remainingSeconds * 1000;
    workingStartedAt = Date.now();
    mainText.textContent = 'Working';
    tomatoImage.src = idleTomato;
    controls.classList.add('is-running');
    tick();
    if (remainingSeconds > 0) {
        intervalId = setInterval(tick, 250);
    }
}

function stopTimer() {
    if (intervalId === null) return;

    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    mainText.textContent = 'Timer paused';
    tomatoImage.src = idleTomato;
    workingStartedAt = null;
    clearInterval(intervalId);
    intervalId = null;
    deadline = null;
    controls.classList.remove('is-running');
    displayTime();
}

function tick() {
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    displayTime();
    const dotCount = Math.floor((Date.now() - workingStartedAt) / 500) % 4;
    mainText.textContent = `Working${'.'.repeat(dotCount)}`;
    const tomatoFrame = Math.floor((Date.now() - workingStartedAt) / 500) % tomatoFrames.length;
    tomatoImage.src = tomatoFrames[tomatoFrame];

    if (remainingSeconds === 0) {
        mainText.textContent = "Time's up!";
        tomatoImage.src = idleTomato;
        workingStartedAt = null;
        clearInterval(intervalId);
        intervalId = null;
        deadline = null;
        controls.classList.remove('is-running');
    }
}

minusButton.addEventListener('click', () => changeTime(-5));
plusButton.addEventListener('click', () => changeTime(5));
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);

displayTime();