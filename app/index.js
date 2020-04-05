import renderApp from './renderApp.js';
import availableLayouts from './layouts.js';

const currentLayout = availableLayouts.english;

renderApp();

const currentLayoutKeycodes = Object.keys(currentLayout);
const output = [];

const preventDefault = (event) => {
  event.preventDefault();
};

const makeActive = (event) => {
  document.querySelector(`.c${event.keyCode}`).classList.add('active');
};

const makeNotActive = (event) => {
  document.querySelector(`.c${event.keyCode}`).classList.remove('active');
};

const makeShift = () => {
  const shiftValues = document.querySelectorAll('.key > .shift');
  const unshiftValues = document.querySelectorAll('.key> .unshift');
  for (let i = 0; i < unshiftValues.length; i += 1) {
    const element = unshiftValues[i];
    element.classList.add('hidden');
  }
  for (let i = 0; i < shiftValues.length; i += 1) {
    const element = shiftValues[i];
    element.classList.remove('hidden');
  }
};

const makeUnshift = () => {
  const shiftValues = document.querySelectorAll('.key > .shift');
  const unshiftValues = document.querySelectorAll('.key> .unshift');
  for (let i = 0; i < shiftValues.length; i += 1) {
    const element = shiftValues[i];
    element.classList.add('hidden');
  }
  for (let i = 0; i < unshiftValues.length; i += 1) {
    const element = unshiftValues[i];
    element.classList.remove('hidden');
  }
};

const changeOutput = (event) => {
  const key = event.keyCode;
  const shiftState = +event.shiftKey;
  const selStart = document.querySelector('textarea').selectionStart;
  const selEnd = document.querySelector('textarea').selectionEnd;
  const sel = selEnd - selStart;
  if (key === 8) {
    if (sel === 0) {
      output.splice(selStart - 1, sel + 1);
      document.querySelector('textarea').textContent = output.join('');
    } else {
      output.splice(selStart, sel);
      document.querySelector('textarea').textContent = output.join('');
    }
  } else if (key === 46) {
    if (sel === 0) {
      output.splice(selStart, sel + 1);
      document.querySelector('textarea').textContent = output.join('');
    } else {
      output.splice(selStart, sel);
      document.querySelector('textarea').textContent = output.join('');
    }
  } else {
    output.splice(selStart, sel, currentLayout[key][shiftState]);
    document.querySelector('textarea').textContent = output.join('');
    document.querySelector('textarea').selectionStart = output.length;
  }
};

const changeCursorPosition = (event) => {
  let currentCursorPosition = document.querySelector('textarea').selectionStart;
  if (event.keyCode === 37 && currentCursorPosition > 0) {
    while (currentCursorPosition >= 0) {
      currentCursorPosition -= 1;
      document.querySelector('textarea').selectionStart -= 1;
    }
  }
  if (event.keyCode === 39 && currentCursorPosition < output.length) {
    while (currentCursorPosition <= output.length) {
      currentCursorPosition += 1;
      document.querySelector('textarea').selectionStart += 1;
    }
  }
};

const keydown = (event) => {
  preventDefault(event);
  console.log(event.key);
  if (event.keyCode === 16) { makeShift(); }
  if (event.keyCode === 37 || event.keyCode === 39) { changeCursorPosition(event); }
  makeActive(event);
  changeOutput(event);
};

const keyup = (event) => {
  preventDefault(event);
  if (event.keyCode === 16) { makeUnshift(); }
  makeNotActive(event);
};

const keypress = (event) => {
  preventDefault(event);
};

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
document.addEventListener('keypress', keypress);
