/*! markdown-it-prism 2.1.8-6 https://github.com//GerHobbelt/markdown-it-prism @license MIT */

'use strict';

var Prism = require('@gerhobbelt/prismjs');
var loadLanguages = require('@gerhobbelt/prismjs/components/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Prism__default = /*#__PURE__*/_interopDefaultLegacy(Prism);
var loadLanguages__default = /*#__PURE__*/_interopDefaultLegacy(loadLanguages);

const DEFAULTS = {
  plugins: [],
  init: () => {// do nothing by default
  },
  defaultLanguageForUnknown: undefined,
  defaultLanguageForUnspecified: undefined,
  defaultLanguage: undefined,
  noKnownLanguageCallback: undefined
};
/**
 * Loads the provided {@code lang} into prism.
 *
 * @param lang
 *        Code of the language to load.
 * @return The Prism language object for the provided {@code lang} code. {@code undefined} if the language is not known to Prism.
 */

function loadPrismLang(lang) {
  if (!lang) return undefined;
  let langObject = Prism__default['default'].languages[lang];

  if (langObject === undefined) {
    loadLanguages__default['default']([lang]);
    langObject = Prism__default['default'].languages[lang];
  }

  return langObject;
}
/**
 * Loads the provided Prism plugin.a
 * @param name
 *        Name of the plugin to load
 * @throws {Error} If there is no plugin with the provided {@code name}
 */


function loadPrismPlugin(name) {
  try {
    require(`@gerhobbelt/prismjs/plugins/${name}/prism-${name}`);
  } catch (e) {
    throw new Error(`Cannot load Prism plugin "${name}". Please check the spelling.`);
  }
}
/**
 * Select the language to use for highlighting, based on the provided options and the specified language.
 *
 * @param options
 *        The options that were used to initialise the plugin.
 * @param lang
 *        Code of the language to highlight the text in.
 * @return An array where the first element is the name of the language to use, and the second element is the PRISM language object for that language.
 */


function selectLanguage(options, lang) {
  let langToUse = lang;

  if (langToUse === '' && options.defaultLanguageForUnspecified !== undefined) {
    langToUse = options.defaultLanguageForUnspecified;
  }

  let prismLang = loadPrismLang(langToUse);

  if (prismLang === undefined && options.defaultLanguageForUnknown !== undefined) {
    langToUse = options.defaultLanguageForUnknown;
    prismLang = loadPrismLang(langToUse);
  }

  return [langToUse, prismLang];
}
/**
 * Highlights the provided text using Prism.
 *
 * @param markdownit
 *        Instance of MarkdownIt Class. This argument is bound in markdownItPrism().
 * @param options
 *        The options that have been used to initialise the plugin. This argument is bound in markdownItPrism().
 * @param text
 *        The text to highlight.
 * @param lang
 *        Code of the language to highlight the text in.
 * @return {@code text} wrapped in {@code &lt;pre&gt;} and {@code &lt;code&gt;}, both equipped with the appropriate class
 *  (markdown-it’s langPrefix + lang). If Prism knows {@code lang}, {@code text} will be highlighted by it.
 */


function highlight(markdownit, options, text, lang) {
  const [langToUse, prismLang] = selectLanguage(options, lang);
  let code;

  if (prismLang) {
    code = Prism__default['default'].highlight(text, prismLang, langToUse);
  } else {
    if (options.noKnownLanguageCallback && lang) {
      options.noKnownLanguageCallback(`There is no Prism language '${lang}' for highlight chunk:\n${text}`, lang, loadLanguages__default['default'].getSupportedLanguages());
    }

    code = markdownit.utils.escapeHtml(text);
  }

  const classAttribute = langToUse ? ` class="${markdownit.options.langPrefix}${markdownit.utils.escapeHtml(langToUse)}"` : '';
  return `<pre${classAttribute}><code${classAttribute}>${code}</code></pre>`;
}
/**
 * Checks whether an option represents a valid Prism language
 *
 * @param options
 *        The options that have been used to initialise the plugin.
 * @param optionName
 *        The key of the option inside {@code options} that shall be checked.
 * @throws {Error} If the option is not set to a valid Prism language.
 */


function checkLanguageOption(options, optionName) {
  const language = options[optionName];

  if (language !== undefined && loadPrismLang(language) === undefined) {
    throw new Error(`Bad option ${optionName}: There is no Prism language '${language}'.`);
  }
}
/**
 * Initialisation function of the plugin. This function is not called directly by clients, but is rather provided
 * to MarkdownIt’s {@link MarkdownIt.use} function.
 *
 * @param markdownit
 *        The markdown it instance the plugin is being registered to.
 * @param useroptions
 *        The options this plugin is being initialised with.
 */


function markdownItPrism(markdownit, useroptions) {
  const options = Object.assign({}, DEFAULTS, useroptions);
  checkLanguageOption(options, 'defaultLanguage');
  checkLanguageOption(options, 'defaultLanguageForUnknown');
  checkLanguageOption(options, 'defaultLanguageForUnspecified');
  options.defaultLanguageForUnknown = options.defaultLanguageForUnknown || options.defaultLanguage;
  options.defaultLanguageForUnspecified = options.defaultLanguageForUnspecified || options.defaultLanguage;
  options.plugins.forEach(loadPrismPlugin);
  options.init(Prism__default['default']); // register ourselves as highlighter

  markdownit.options.highlight = (text, lang) => highlight(markdownit, options, text, lang);
}

module.exports = markdownItPrism;
//# sourceMappingURL=markdownItPrism.cjs.map
