import Keyboard from './keyboard/Keyboard.js';
import keyboardModel from './keyboard/keyboardModel.js';
import * as settings from './config/settings.js';

let colorScheme;
if (settings.currentConfig.scheme === 'system') {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    colorScheme = 'dark';
  } else {
    colorScheme = 'light';
  }
} else {
  colorScheme = settings.currentConfig.scheme;
}

const createOutput = () => {
  const section = document.createElement('section');
  const textarea = document.createElement('textarea');
  document.querySelector('main').appendChild(section).setAttribute('id', 'output');
  document.querySelector('#output').appendChild(textarea).setAttribute('name', 'output');
  document.querySelector('textarea').style.fontSize = `${settings.currentConfig.fontSize}px`;
};

const createServiceBlock = () => {
  const serviceBlock = document.createElement('section');
  serviceBlock.setAttribute('id', 'service');
  const capsLockState = document.createElement('div');
  capsLockState.textContent = `Caps Lock: ${(settings.currentConfig.capsLockState) ? 'on' : 'off'}`;
  capsLockState.classList.add('capsLockState');
  const currentLayout = document.createElement('div');
  currentLayout.textContent = `Layout: ${settings.currentConfig.layout}`;
  currentLayout.classList.add('currentLayout');
  const scheme = document.createElement('div');
  scheme.textContent = `Color scheme: ${settings.currentConfig.scheme}`;
  scheme.classList.add('scheme');
  const switchLayout = document.createElement('div');
  switchLayout.textContent = `Layout switching: ${settings.currentConfig.switchLayout}`;
  switchLayout.classList.add('switchLayout');
  serviceBlock.appendChild(capsLockState);
  serviceBlock.appendChild(currentLayout);
  serviceBlock.appendChild(switchLayout);
  serviceBlock.appendChild(scheme);
  document.querySelector('main').appendChild(serviceBlock);
};

export const createKeyboard = (layout) => {
  const keyboard = new Keyboard(keyboardModel, layout);
  document.querySelector('main').appendChild(keyboard.createHtml());
  if (settings.currentConfig.capsLockState) {
    const unshiftValues = document.querySelectorAll('.key> .unshift');
    for (let i = 0; i < unshiftValues.length; i += 1) {
      const element = unshiftValues[i];
      element.classList.add('hidden');
    }
  } else {
    const shiftValues = document.querySelectorAll('.shift');
    for (let i = 0; i < shiftValues.length; i += 1) {
      const element = shiftValues[i];
      element.classList.add('hidden');
    }
  }
};

export const renderApp = (layout) => {
  const main = document.createElement('main');
  document.querySelector('body').appendChild(main);
  document.querySelector('main').classList.add(`${colorScheme}`);
  createOutput();
  createServiceBlock();
  createKeyboard(layout);
};
