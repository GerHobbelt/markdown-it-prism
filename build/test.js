"use strict";

var _chai = _interopRequireWildcard(require("chai"));

var _chaiString = _interopRequireDefault(require("chai-string"));

var _markdownIt = _interopRequireDefault(require("@gerhobbelt/markdown-it"));

var _index = _interopRequireDefault(require("./index"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env mocha */
_chai.default.use(_chaiString.default);

const read = path => _fs.default.readFileSync(`testdata/${path}`).toString();

describe('markdown-it-prism', () => {
  it('highlights fenced code blocks with language specification using Prism', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(read('input/fenced-with-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('throws for unknown plugins', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      plugins: ['foo']
    })).to.throw(Error, /plugin/);
  });
  it('throws for unknown defaultLanguage', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      defaultLanguage: 'i-dont-exist'
    })).to.throw(Error, /defaultLanguage.*i-dont-exist/);
  });
  it('throws for unknown defaultLanguageForUnknown', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      defaultLanguageForUnknown: 'i-dont-exist'
    })).to.throw(Error, /defaultLanguageForUnknown.*i-dont-exist/);
  });
  it('throws for unknown defaultLanguageForUnspecified', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      defaultLanguageForUnspecified: 'i-dont-exist'
    })).to.throw(Error, /defaultLanguageForUnspecified.*i-dont-exist/);
  });
  it('offers an init function for further initialisation', () => {
    let called = false;
    (0, _markdownIt.default)().use(_index.default, {
      init: prism => {
        (0, _chai.expect)(prism).to.have.ownProperty('plugins');
        called = true;
      }
    });
    (0, _chai.expect)(called).to.be.true;
  });
  it('does not add classes to fenced code blocks without language specification', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(read('input/fenced-without-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-without-language.html'));
  });
  it('falls back to defaultLanguageForUnspecified if no language is specified', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      defaultLanguageForUnspecified: 'java'
    }).render(read('input/fenced-without-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('falls back to defaultLanguage if no language and no defaultLanguageForUnspecified is specified', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      defaultLanguage: 'java'
    }).render(read('input/fenced-without-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('falls back to defaultLanguage if no language and no defaultLanguageForUnspecified is specified, while noKnownLanguageCallback option is specified', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      defaultLanguage: 'java',
      noKnownLanguageCallback: (msg
      /* , lang, available */
      ) => {
        throw new Error(msg);
      }
    }).render(read('input/fenced-without-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('does not invoke noKnownLanguageCallback if no language and no defaultLanguage is specified', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      noKnownLanguageCallback: (msg
      /* , lang, available */
      ) => {
        throw new Error(msg);
      }
    }).render(read('input/fenced-without-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-without-language.html'));
  });
  it('invokes noKnownLanguageCallback if language is specified but unknown', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      noKnownLanguageCallback: (msg
      /* , lang, available */
      ) => {
        throw new Error(msg);
      }
    }).render(read('input/fenced-with-unknown-language.md'))).to.throw(Error, /There is no Prism language/);
  });
  it('does not add classes to indented code blocks', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(read('input/indented.md'))).to.equalIgnoreSpaces(read('expected/indented.html'));
  });
  it('adds classes even if the language is unknown', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(read('input/fenced-with-unknown-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-unknown-language.html'));
  });
  it('falls back to defaultLanguageForUnknown if the specified language is unknown', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      defaultLanguageForUnknown: 'java'
    }).render(read('input/fenced-with-unknown-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('falls back to defaultLanguage if the specified language is unknown and no defaultLanguageForUnknown is specified', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      defaultLanguage: 'java'
    }).render(read('input/fenced-with-unknown-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language.html'));
  });
  it('respects markdown-it’s langPrefix setting', () => {
    (0, _chai.expect)((0, _markdownIt.default)({
      langPrefix: 'test-'
    }).use(_index.default).render(read('input/fenced-with-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language-prefix.html'));
  });
  it('is able to resolve C++ correctly', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(read('input/cpp.md'))).to.equalIgnoreSpaces(read('expected/cpp.html'));
  }); // This test must be the last one, as the plugins get loaded into Prism and cannot be unloaded!

  it('allows to use Prism plugins', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      plugins: ['highlight-keywords', 'show-language']
    }).render(read('input/fenced-with-language.md'))).to.equalIgnoreSpaces(read('expected/fenced-with-language-plugins.html'));
  });
});