import renderApp from './renderApp.js';
import availableLayouts from './layouts.js';

const currentLayout = availableLayouts.english;

renderApp();

const output = [];
const functionalKeys = /Escape|CapsLock|Shift|Control|Alt|ContextMenu|NumpadEnter/;
let currentCursorPosition = 0;

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

const changeCursorPosition = (action, number) => {
  if (action === 'reduce' && currentCursorPosition > 0) {
    currentCursorPosition -= number;
    document.querySelector('textarea').selectionStart = currentCursorPosition;
    document.querySelector('textarea').selectionEnd = currentCursorPosition;
  }
  if (action === 'increase' && currentCursorPosition < output.length) {
    currentCursorPosition += number;
    document.querySelector('textarea').selectionStart = currentCursorPosition;
    document.querySelector('textarea').selectionEnd = currentCursorPosition;
  }
  if (action === 'stay') {
    document.querySelector('textarea').selectionStart = currentCursorPosition;
    document.querySelector('textarea').selectionEnd = currentCursorPosition;
  }
};

const changeOutput = (event) => {
  const key = event.code;
  const shiftState = +event.shiftKey;
  const selStart = document.querySelector('textarea').selectionStart;
  const selEnd = document.querySelector('textarea').selectionEnd;
  const sel = selEnd - selStart;
  if (!functionalKeys.test(event.code)) {
    switch (key) {
      case 'Backspace':
        if (sel === 0) {
          output.splice(selStart - 1, 1);
          document.querySelector('textarea').textContent = output.join('');
          changeCursorPosition('reduce', 1);
        } else {
          output.splice(selStart, sel);
          document.querySelector('textarea').textContent = output.join('');
          changeCursorPosition('stay');
        }
        break;
      case 'Delete':
        if (sel === 0) {
          output.splice(selStart, 1);
          document.querySelector('textarea').textContent = output.join('');
          changeCursorPosition('stay');
        } else {
          output.splice(selStart, sel);
          document.querySelector('textarea').textContent = output.join('');
          changeCursorPosition('stay');
        }
        break;
      case 'ArrowLeft':
        changeCursorPosition('reduce', 1);
        break;
      case 'ArrowUp':
        changeCursorPosition('reduce', 1);
        break;
      case 'ArrowRight':
        changeCursorPosition('increase', 1);
        break;
      case 'ArrowDown':
        changeCursorPosition('increase', 1);
        break;
      default:
        output.splice(selStart, sel, currentLayout[key][shiftState]);
        document.querySelector('textarea').textContent = output.join('');
        changeCursorPosition('increase', 1);
    }
  }
};


const keydown = (event) => {
  preventDefault(event);
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') { makeShift(); }
  if (event.code.includes('Arrow')) { changeCursorPosition(event.code); }
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
document.querySelector('textarea').addEventListener('click', (event) => { currentCursorPosition = document.querySelector('textarea').selectionStart; });
