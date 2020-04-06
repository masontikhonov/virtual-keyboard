import renderApp from './renderApp.js';
import availableLayouts from './layouts.js';

const currentLayout = availableLayouts.english;

renderApp();

const output = [];
const functionalKeys = /Escape|CapsLock|Shift|Control|Alt|ContextMenu/;
let currentCursorPosition = 0;
let shiftState = 0;
let capsLockState = 0;

const preventDefault = (event) => {
  event.preventDefault();
};

const makeActive = (keyCode) => {
  document.querySelector(`#${keyCode}`).classList.add('active');
};

const makeNotActive = (keyCode) => {
  document.querySelector(`#${keyCode}`).classList.remove('active');
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
  shiftState = 1;
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
  shiftState = 0;
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

const changeOutput = (keyCode) => {
  document.querySelector('textarea').focus();
  const charShiftType = Math.abs(capsLockState - shiftState);
  const selStart = document.querySelector('textarea').selectionStart;
  const selEnd = document.querySelector('textarea').selectionEnd;
  const sel = selEnd - selStart;
  if (!functionalKeys.test(keyCode)) {
    switch (keyCode) {
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
        output.splice(selStart, sel, currentLayout[keyCode][charShiftType]);
        document.querySelector('textarea').textContent = output.join('');
        changeCursorPosition('increase', 1);
    }
  }
};

const keydown = (event) => {
  const keyCode = event.code;
  shiftState = +event.shiftKey;
  preventDefault(event);
  if (keyCode.includes('Shift') && !capsLockState) { makeShift(); }
  if (keyCode.includes('Shift') && capsLockState) { makeUnshift(); }
  if (keyCode.includes('Arrow')) { changeCursorPosition(keyCode); }
  makeActive(keyCode);
  changeOutput(keyCode, shiftState);
};

const keyup = (event) => {
  const keyCode = event.code;
  preventDefault(event);
  if (keyCode.includes('Shift') && !capsLockState) { makeUnshift(); }
  if (keyCode.includes('Shift') && capsLockState) { makeShift(); }
  if (keyCode === 'CapsLock') { changeCapsLockState(); }
  makeNotActive(keyCode);
};

const detectKeyCode = (event) => {
  const { target } = event;
  let keyCode;
  if (target.classList.contains('key')) {
    keyCode = target.id;
  }
  if (target.classList.contains('shift') || target.classList.contains('unshift')) {
    keyCode = target.parentNode.id;
  }
  return keyCode;
};

const mouseDown = (event) => {
  const keyCode = detectKeyCode(event);
  if (keyCode === undefined) { return; }
  if (keyCode.includes('Shift')) {
    if (document.querySelector(`#${keyCode}`).classList.contains('active')) {
      makeNotActive(keyCode);
      makeUnshift();
    } else {
      makeActive(keyCode);
      makeShift();
    }
  }
  changeOutput(keyCode);
};

const mouseUp = (event) => {
  const keyCode = detectKeyCode(event);
  if (keyCode === undefined) { return; }
  if (!keyCode.includes('Shift')) {
    makeNotActive('ShiftLeft');
    makeNotActive('ShiftRight');
    makeUnshift();
  }
  document.querySelector('textarea').focus();
};

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
document.querySelector('textarea').addEventListener('click', () => { currentCursorPosition = document.querySelector('textarea').selectionStart; });
document.addEventListener('mousedown', mouseDown);
document.addEventListener('mouseup', mouseUp);
