"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prismjs = _interopRequireDefault(require("prismjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULTS = {
  plugins: [],
  init: () => {}
};
/**
 * Loads the provided <code>lang</code> into prism.
 *
 * @param <String> lang
 *		Code of the language to load.
 * @return <Object?> The prism language object for the provided <code>lang</code> code. <code>undefined</code> if the code is not known to prism.
 */

function loadPrismLang(lang) {
  let langObject = _prismjs.default.languages[lang];

  if (langObject === undefined) {
    try {
      require('prismjs/components/prism-' + lang);

      return _prismjs.default.languages[lang];
    } catch (e) {// nothing to do
    }
  }

  return langObject;
}

function loadPrismPlugin(name) {
  try {
    require(`prismjs/plugins/${name}/prism-${name}`);
  } catch (e) {
    throw new Error(`Cannot load Prism plugin "${name}". Please check the spelling.`);
  }
}
/**
 * Highlights the provided text using Prism.
 *
 * @param <String> text
 * 		The text to highlight.
 * @param <String> lang
 *		Code of the language to highlight the text in.
 * @return <String> If Prism can highlight <code>text</code> in using <code>lang</code>, the highlighted code. Unchanged <code>text</code> otherwise.
 */


function highlight(text, lang) {
  const prismLang = loadPrismLang(lang);

  if (prismLang) {
    return _prismjs.default.highlight(text, prismLang);
  }
}

function markdownItPrism(markdownit, useroptions) {
  const options = Object.assign({}, DEFAULTS, useroptions);
  options.plugins.forEach(loadPrismPlugin);
  options.init(_prismjs.default); // register ourselves as highlighter

  markdownit.options.highlight = highlight;
}

var _default = markdownItPrism;
exports.default = _default;
module.exports = exports.default;