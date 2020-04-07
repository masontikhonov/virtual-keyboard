import * as renderer from './renderer.js';
import * as settings from './config/settings.js';

const { layouts } = settings;
const { currentConfig } = settings;


const layoutList = Object.keys(layouts);
let currentLayout = layouts[currentConfig.layout];
renderer.renderApp(currentLayout);

const output = [];
const functionalKeys = /Escape|CapsLock|Shift|Control|Alt|ContextMenu/;
const funcKeysSequence = {};
let currentCursorPosition = 0;
let shiftState = 0;
let { capsLockState } = currentConfig;

const switchLayout = () => {
  const currentLayoutNumber = layoutList.indexOf(currentConfig.layout);
  if (currentLayoutNumber < layoutList.length - 1) {
    currentConfig.layout = layoutList[currentLayoutNumber + 1];
  } else {
    currentConfig.layout = layoutList[0];
  }
  currentLayout = layouts[currentConfig.layout];
  settings.saveCurrentConfig(currentConfig);
  document.getElementById('keyboard').remove();
  renderer.createKeyboard(currentLayout);
};

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
  currentConfig.capsLockState = capsLockState;
  settings.saveCurrentConfig(currentConfig);
  if (capsLockState) {
    document.querySelector('#CapsLock').classList.add('active');
    makeShift();
  } else {
    document.querySelector('#CapsLock').classList.remove('active');
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

const listenFuncKeys = (keyCode) => {
  if (functionalKeys.test(keyCode)) {
    funcKeysSequence[keyCode] = true;
  }
};

const clearFuncKeys = (keyCode) => {
  if (functionalKeys.test(keyCode)) {
    delete funcKeysSequence[keyCode];
  }
};

const performFuncAction = () => {
  const funcKeysSequenceStr = Object.keys(funcKeysSequence).join(' + ');
  switch (funcKeysSequenceStr) {
    case `${settings.currentConfig.switchLayout}`:
      switchLayout();
      break;
    default:
      break;
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
  if (keyCode in currentLayout) {
    preventDefault(event);
    makeActive(keyCode);
    if (keyCode.includes('Shift') && !capsLockState) { makeShift(); }
    if (keyCode.includes('Shift') && capsLockState) { makeUnshift(); }
    if (keyCode.includes('Arrow')) { changeCursorPosition(keyCode); }
    changeOutput(keyCode, shiftState);
    listenFuncKeys(keyCode);
    performFuncAction();
  }
};

const keyup = (event) => {
  const keyCode = event.code;
  if (keyCode in currentLayout) {
    preventDefault(event);
    makeNotActive(keyCode);
    if (keyCode.includes('Shift') && !capsLockState) { makeUnshift(); }
    if (keyCode.includes('Shift') && capsLockState) { makeShift(); }
    if (keyCode === 'CapsLock') { changeCapsLockState(); }
    clearFuncKeys(keyCode);
  }
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
