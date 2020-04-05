import availableLayouts from './layouts.js';
import Keyboard from './keyboard/Keyboard.js';

export default () => {
  const keyboardModel = './app/config/keyboardModel.json';
  const defaultLayout = availableLayouts.english;

  const main = document.createElement('main');
  document.querySelector('body').appendChild(main);

  const createOutput = () => {
    const section = document.createElement('section');
    const textarea = document.createElement('textarea');
    document.querySelector('main').appendChild(section).setAttribute('id', 'output');
    document.querySelector('#output').appendChild(textarea).setAttribute('name', 'output');
  };

  const createServiceBlock = () => {
    const serviceBlock = document.createElement('section');
    serviceBlock.setAttribute('id', 'service');
    const placeholder = document.createElement('div');
    placeholder.textContent = 'placeholder';
    serviceBlock.appendChild(placeholder);
    document.querySelector('main').appendChild(serviceBlock);
  };

  const createKeyboard = (url, layout) => {
    fetch(url).then((response) => {
      response.json().then((parsedJson) => {
        const keyboard = new Keyboard(parsedJson, layout);
        document.querySelector('main').appendChild(keyboard.createHtml());
        const shiftValues = document.querySelectorAll('.shift');
        for (let i = 0; i < shiftValues.length; i += 1) {
          const element = shiftValues[i];
          element.classList.add('hidden');
        }
      });
    });
  };

  createOutput();
  createServiceBlock();
  createKeyboard(keyboardModel, defaultLayout);
};
