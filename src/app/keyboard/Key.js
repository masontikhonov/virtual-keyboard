export default class Key {
  constructor(keyCode, key) {
    this.keyCode = keyCode;
    this.defaultValue = key[0];
    this.shiftValue = key[1];
  }

  createHtml() {
    const keyHtml = document.createElement('div');
    keyHtml.classList.add('key', `c${this.keyCode}`);
    const defaultValue = document.createElement('span');
    defaultValue.classList.add('unshift');
    defaultValue.textContent = (this.keyCode === 9) ? 'Tab' : this.defaultValue;
    const shiftValue = document.createElement('span');
    shiftValue.classList.add('shift');
    shiftValue.textContent = (this.keyCode === 9) ? 'Tab' : this.shiftValue;
    keyHtml.appendChild(defaultValue);
    keyHtml.appendChild(shiftValue);
    return keyHtml;
  }
}
