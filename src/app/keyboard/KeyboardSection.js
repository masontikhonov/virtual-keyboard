import KeyboardRow from './KeyboardRow.js';

export default class KeyboardSection {
  constructor(sectionTitle, section, layout) {
    this.sectionTitle = sectionTitle;
    this.rows = [];
    const rows = Object.keys(section);
    for (let i = 0; i < rows.length; i += 1) {
      const rowNumber = +rows[i];
      const keyCodes = section[rowNumber];
      this.rows.push(new KeyboardRow(rowNumber, keyCodes, layout));
    }
  }

  createHtml() {
    const sectionHtml = document.createElement('section');
    sectionHtml.setAttribute('id', `${this.sectionTitle}`);
    for (let i = 0; i < this.rows.length; i += 1) {
      const row = this.rows[i];
      sectionHtml.appendChild(row.createHtml());
    }
    return sectionHtml;
  }
}
