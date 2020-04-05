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
  document.querySelector(`.${event.code}`).classList.add('active');
};

const makeNotActive = (event) => {
  document.querySelector(`.${event.code}`).classList.remove('active');
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
  const key = event.code;
  const shiftState = +event.shiftKey;
  const selStart = document.querySelector('textarea').selectionStart;
  const selEnd = document.querySelector('textarea').selectionEnd;
  const sel = selEnd - selStart;
  if (key === 'Backspace') {
    if (sel === 0) {
      output.splice(selStart - 1, sel + 1);
      document.querySelector('textarea').textContent = output.join('');
    } else {
      output.splice(selStart, sel);
      document.querySelector('textarea').textContent = output.join('');
    }
  } else if (key === 'Delete') {
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
  if (event.code === 'ArrowLeft' && currentCursorPosition > 0) {
    while (currentCursorPosition >= 0) {
      currentCursorPosition -= 1;
      document.querySelector('textarea').selectionStart -= 1;
    }
  }
  if (event.code === 'ArrowRight' && currentCursorPosition < output.length) {
    while (currentCursorPosition <= output.length) {
      currentCursorPosition += 1;
      document.querySelector('textarea').selectionStart += 1;
    }
  }
};

const keydown = (event) => {
  preventDefault(event);
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') { makeShift(); }
  if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') { changeCursorPosition(event); }
  makeActive(event);
  changeOutput(event);
};

const keyup = (event) => {
  preventDefault(event);
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') { makeUnshift(); }
  makeNotActive(event);
};

const keypress = (event) => {
  preventDefault(event);
};

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
document.addEventListener('keypress', keypress);
