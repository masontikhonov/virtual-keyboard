import KeyboardSection from './KeyboardSection.js';

export default class Keyboard {
  constructor(keyboardModel, layout) {
    this.sections = [];
    const sections = Object.keys(keyboardModel);
    for (let i = 0; i < sections.length; i += 1) {
      const sectionTitle = sections[i];
      const section = keyboardModel[sectionTitle];
      this.sections.push(new KeyboardSection(sectionTitle, section, layout));
    }
  }

  createHtml() {
    const keyboardHtml = document.createElement('section');
    keyboardHtml.setAttribute('id', 'keyboard');
    for (let i = 0; i < this.sections.length; i += 1) {
      const section = this.sections[i];
      keyboardHtml.appendChild(section.createHtml());
    }
    return keyboardHtml;
  }
}
