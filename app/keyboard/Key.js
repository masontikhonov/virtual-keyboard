export default class Key {
  constructor(keyCode, key) {
    this.keyCode = keyCode;
    this.defaultValue = key[0];
    this.shiftValue = key[1];
  }

  createHtml() {
    const keyHtml = document.createElement('div');
    keyHtml.classList.add('key', `${this.keyCode}`);
    const defaultValue = document.createElement('span');
    defaultValue.classList.add('unshift');
    defaultValue.textContent = (this.keyCode === 'Tab') ? 'Tab' : this.defaultValue;
    const shiftValue = document.createElement('span');
    shiftValue.classList.add('shift');
    shiftValue.textContent = (this.keyCode === 'Tab') ? 'Tab' : this.shiftValue;
    keyHtml.appendChild(defaultValue);
    keyHtml.appendChild(shiftValue);
    return keyHtml;
  }
}
