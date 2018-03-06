'use strict';

const postcss = require('postcss');

const postcssStylish = postcss.plugin('postcss-stylish', (req = {}) => {
  return (root, result) => {
    // charset を削除
    root.walkAtRules('charset', (rule) => rule.remove());

    // 開発時の既定オプションへの置換
    root.walkComments((comment) => {
      const match = comment.text.match(/^\[\[(.*)\]\]$/);

      if (req.isProduction && match === null) {
        comment.remove();
      } else if (req.hasOwnProperty('options') && Array.isArray(match)) {
        const option = req.options.find(
          (options) => options.installKey === match[1]
        );
        const rootRule = postcss.parse(option.value);

        comment.replaceWith(rootRule);
      }
    });

    // 優先度を上げる
    root.walkDecls((decl) => {
      const isKeyframe = decl.parent.parent.name === 'keyframes';
      const isFontFace = decl.parent.name === 'font-face';
      const isVariable = decl.prop.startsWith('--');
      const isAll = decl.prop === 'all';

      if (!(isKeyframe || isVariable || isFontFace || isAll)) {
        decl.important = true;
      }
    });
  };
});

module.exports = postcssStylish;
