
import { strict as assert } from 'assert';
import * as fs from 'fs';
import markdownit from '@gerhobbelt/markdown-it';

import markdownItPrism from '../src/';


const read = path => fs.readFileSync(`testdata/${path}`).toString();


const ASSERT = {
  equalIgnoreSpaces: (a, b) => {
    const aa = a.trim().replace(/\r?\n/g, '\n');
    const bb = b.trim().replace(/\r?\n/g, '\n');
    assert.strictEqual(aa, bb);
  }
};


describe('markdown-it-prism', () => {

  it('highlights fenced code blocks with a language specification using Prism', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-with-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('throws for unknown plugins', () => {
    assert.throws(() => markdownit()
			.use(markdownItPrism, {
			  plugins: [ 'foo' ]
			}), /plugin/);
  });

  it('throws for unknown defaultLanguage', () => {
    assert.throws(() => markdownit()
			.use(markdownItPrism, {
			  defaultLanguage: 'i-dont-exist'
			}), /defaultLanguage.*i-dont-exist/);
  });

  it('throws for unknown defaultLanguageForUnknown', () => {
    assert.throws(() => markdownit()
			.use(markdownItPrism, {
			  defaultLanguageForUnknown: 'i-dont-exist'
			}), /defaultLanguageForUnknown.*i-dont-exist/);
  });

  it('throws for unknown defaultLanguageForUnspecified', () => {
    assert.throws(() => markdownit()
			.use(markdownItPrism, {
			  defaultLanguageForUnspecified: 'i-dont-exist'
			}), /defaultLanguageForUnspecified.*i-dont-exist/);
  });

  it('offers an init function for further initialisation', () => {
    let called = false;
    markdownit()
			.use(markdownItPrism, {
			  init: prism => {
			    assert.ok(prism.hasOwnProperty('plugins'));
			    called = true;
			  }
			});
    assert.strictEqual(called, true);
  });

  it('does not add classes to fenced code blocks without language specification', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-without-language.md')),
    read('expected/fenced-without-language.html'));
  });

  it('falls back to defaultLanguageForUnspecified if no language is specified', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  defaultLanguageForUnspecified: 'java'
			})
			.render(read('input/fenced-without-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('falls back to defaultLanguage if no language and no defaultLanguageForUnspecified is specified', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  defaultLanguage: 'java'
			})
			.render(read('input/fenced-without-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('falls back to defaultLanguage if no language and no defaultLanguageForUnspecified is specified, while noKnownLanguageCallback option is specified', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  defaultLanguage: 'java',
			  noKnownLanguageCallback: (msg /* , lang, available */) => {
			    throw new Error(msg);
			  }
			})
			.render(read('input/fenced-without-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('does not invoke noKnownLanguageCallback if no language and no defaultLanguage is specified', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  noKnownLanguageCallback: (msg /* , lang, available */) => {
			    throw new Error(msg);
			  }
			})
			.render(read('input/fenced-without-language.md')),
    read('expected/fenced-without-language.html'));
  });

  it('invokes noKnownLanguageCallback if language is specified but unknown', () => {
    assert.throws(() => markdownit()
			.use(markdownItPrism, {
			  noKnownLanguageCallback: (msg /* , lang, available */) => {
			    throw new Error(msg);
			  }
			})
			.render(read('input/fenced-with-unknown-language.md')),
    /There is no Prism language/);
  });

  it('does not add classes to indented code blocks', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/indented.md')),
    read('expected/indented.html'));
  });

  it('adds classes even if the language is unknown', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-with-unknown-language.md')),
    read('expected/fenced-with-unknown-language.html'));
  });

  it('escapes HTML in the language name', async () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/fenced-with-html-in-language.md')),
    read('expected/fenced-with-html-in-language.html'));
  });

  it('falls back to defaultLanguageForUnknown if the specified language is unknown', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  defaultLanguageForUnknown: 'java'
			})
			.render(read('input/fenced-with-unknown-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('falls back to defaultLanguage if the specified language is unknown and no defaultLanguageForUnknown is specified', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  defaultLanguage: 'java'
			})
			.render(read('input/fenced-with-unknown-language.md')),
    read('expected/fenced-with-language.html'));
  });

  it('respects markdown-it’s langPrefix setting', () => {
    ASSERT.equalIgnoreSpaces(
      markdownit({
        langPrefix: 'test-'
      })
				.use(markdownItPrism)
				.render(read('input/fenced-with-language.md')),
      read('expected/fenced-with-language-prefix.html'));
  });

  it('is able to resolve C++ correctly', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism)
			.render(read('input/cpp.md')),
    read('expected/cpp.html'));
  });

	// This test must be the last one, as the plugins get loaded into Prism and cannot be unloaded!
  //
  // [EDIT: in ES2017/ES6/ESM, you should *explicitly* *import* plugins as prism uses obsoleted require() internally.]
  xit('allows to use Prism plugins', () => {
    ASSERT.equalIgnoreSpaces(markdownit()
			.use(markdownItPrism, {
			  plugins: [
			    'highlight-keywords',
			    'show-language'
			  ]
			})
			.render(read('input/fenced-with-language.md')),
    read('expected/fenced-with-language-plugins.html'));
  });
});
