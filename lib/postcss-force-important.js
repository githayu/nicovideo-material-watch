'use strict';

const postcss = require('postcss');

const forceImportant = postcss.plugin('postcss-force-important', (opts = {}) => {
  return (root, result) => {
    // remove charset (stylish)
    root.first.remove();

    root.walkDecls(decl => {
      const isKeyframe = decl.parent.parent.name === 'keyframes';
      const isVariable = decl.prop.startsWith('--');
      const isFontFace = decl.parent.name === 'font-face';
      const isAll = decl.prop === 'all';

      if (!(isKeyframe || isVariable || isFontFace || isAll)) {
        decl.important = true;
      }
    });
  }
});

module.exports = forceImportant;
