"use strict";

var _chai = _interopRequireWildcard(require("chai"));

var _chaiString = _interopRequireDefault(require("chai-string"));

var _markdownIt = _interopRequireDefault(require("markdown-it"));

var _index = _interopRequireDefault(require("./index"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env mocha */
_chai.default.use(_chaiString.default);

const read = path => _fs.default.readFileSync(`testdata/${path}`).toString();

describe('markdown-it-prism', () => {
  const input = read('input/test.md');
  it('should highlight fenced code blocks using Prism', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default).render(input)).to.equalIgnoreSpaces(read('expected/normal.html'));
  });
  it('should allow to use Prism plugins', () => {
    (0, _chai.expect)((0, _markdownIt.default)().use(_index.default, {
      plugins: ['highlight-keywords', 'show-language']
    }).render(input)).to.equalIgnoreSpaces(read('expected/plugins.html'));
  });
  it('throws for unknown plugins', () => {
    (0, _chai.expect)(() => (0, _markdownIt.default)().use(_index.default, {
      plugins: ['foo']
    })).to.throw(Error, /plugin/);
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
});