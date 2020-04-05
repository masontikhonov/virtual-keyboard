import renderApp from './renderApp.js';
import availableLayouts from './layouts.js';

const currentLayout = availableLayouts.english;

renderApp();

const output = [];
const functionalKeys = /Escape|CapsLock|Shift|Control|Alt|ContextMenu/;
let currentCursorPosition = 0;
let capsLockState = 0;

const preventDefault = (event) => {
  event.preventDefault();
};

const makeActive = (event) => {
  switch (event.type) {
    case 'keydown':
      document.querySelector(`.${event.code}`).classList.add('active');
      break;
    case 'mousedown':
      if (event.target.classList.contains('key')) {
        event.target.classList.add('active');
      }
      if (event.target.classList.contains('shift') || event.target.classList.contains('unshift')) {
        event.target.parentNode.classList.add('active');
      }
      break;
    default:
      break;
  }
};

const makeNotActive = (event) => {
  switch (event.type) {
    case 'keyup':
      document.querySelector(`.${event.code}`).classList.remove('active');
      break;
    case 'mouseup':
      if (event.target.classList.contains('key')) {
        event.target.classList.remove('active');
      }
      if (event.target.classList.contains('shift') || event.target.classList.contains('unshift')) {
        event.target.parentNode.classList.remove('active');
      }
      break;
    default:
      break;
  }
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

const changeCapsLockState = () => {
  capsLockState = (capsLockState === 0) ? 1 : 0;
  if (capsLockState) {
    makeShift();
  } else {
    makeUnshift();
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
  document.querySelector('textarea').focus();
  if (event.type === 'keydown') {
    const key = event.code;
    const shiftState = +event.shiftKey;
    const charShiftType = Math.abs(capsLockState - shiftState);
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
          output.splice(selStart, sel, currentLayout[key][charShiftType]);
          document.querySelector('textarea').textContent = output.join('');
          changeCursorPosition('increase', 1);
      }
    }
  }
  if (event.type === 'mousedown') {
    
  }
};

const keydown = (event) => {
  preventDefault(event);
  if (event.code.includes('Shift') && !capsLockState) { makeShift(); }
  if (event.code.includes('Shift') && capsLockState) { makeUnshift(); }
  if (event.code.includes('Arrow')) { changeCursorPosition(event.code); }
  makeActive(event);
  changeOutput(event);
};

const keyup = (event) => {
  preventDefault(event);
  if (event.code.includes('Shift') && !capsLockState) { makeUnshift(); }
  if (event.code.includes('Shift') && capsLockState) { makeShift(); }
  if (event.code === 'CapsLock') { changeCapsLockState(); }
  makeNotActive(event);
};

const mouseDown = (event) => {
  makeActive(event);
  changeOutput(event);
};

const mouseUp = (event) => {
  makeNotActive(event);
};

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
document.querySelector('textarea').addEventListener('click', () => { currentCursorPosition = document.querySelector('textarea').selectionStart; });
document.addEventListener('mousedown', mouseDown);
document.addEventListener('mouseup', mouseUp);
