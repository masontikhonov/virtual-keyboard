import defaultLayouts from './defaultLayouts.js';
import defaultConfig from './defaultConfig.js';

const loadLayouts = () => {
  let layouts;
  if (localStorage.getItem('layouts') === null) {
    layouts = defaultLayouts;
    localStorage.setItem('layouts', JSON.stringify(layouts));
  } else {
    layouts = JSON.parse(localStorage.getItem('layouts'));
  }
  return layouts;
};

export const saveCurrentConfig = (currentConfig) => {
  localStorage.setItem('currentConfig', JSON.stringify(currentConfig));
};

const loadCurrentConfig = () => {
  let currentConfig;
  if (localStorage.getItem('currentConfig') === null) {
    currentConfig = defaultConfig;
    saveCurrentConfig(currentConfig);
  } else {
    currentConfig = JSON.parse(localStorage.getItem('currentConfig'));
  }
  return currentConfig;
};

export const currentConfig = loadCurrentConfig();

export const layouts = loadLayouts();
