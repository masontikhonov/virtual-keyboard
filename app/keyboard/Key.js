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
    if (this.keyCode === 'Tab') {
      defaultValue.textContent = 'Tab';
    } else if (this.keyCode.includes('Enter')) {
      defaultValue.textContent = 'Enter';
    } else {
      defaultValue.textContent = this.defaultValue;
    }
    const shiftValue = document.createElement('span');
    shiftValue.classList.add('shift');
    if (this.keyCode === 'Tab') {
      shiftValue.textContent = 'Tab';
    } else if (this.keyCode.includes('Enter')) {
      shiftValue.textContent = 'Enter';
    } else {
      shiftValue.textContent = this.shiftValue;
    }
    keyHtml.appendChild(defaultValue);
    keyHtml.appendChild(shiftValue);
    return keyHtml;
  }
}
