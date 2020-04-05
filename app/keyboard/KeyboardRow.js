import Key from './Key.js';

export default class KeyboardRow {
  constructor(rowNumber, keyCodes, layout) {
    this.rowNumber = rowNumber;
    this.keys = [];
    for (let i = 0; i < keyCodes.length; i += 1) {
      const key = keyCodes[i];
      this.keys.push(new Key(key, layout[key]));
    }
  }

  createHtml() {
    const rowHtml = document.createElement('div');
    rowHtml.classList.add('row', `row-${this.rowNumber}`);
    for (let i = 0; i < this.keys.length; i += 1) {
      const key = this.keys[i];
      rowHtml.appendChild(key.createHtml());
    }
    return rowHtml;
  }
}
