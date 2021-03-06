import Prism from '@gerhobbelt/prismjs';
import MarkdownIt from '@gerhobbelt/markdown-it';
interface Options {
    plugins: string[];
    /**
     * Callback for Prism initialisation. Useful for initialising plugins.
     * @param prism The Prism instance that will be used by the plugin.
     */
    init: (prism: typeof Prism) => void;
    /**
     * The language to use for code blocks that specify a language that Prism does not know.
     */
    defaultLanguageForUnknown?: string;
    /**
     * The language to use for code blocks that do not specify a language.
     */
    defaultLanguageForUnspecified?: string;
    /**
     * Shorthand to set both {@code defaultLanguageForUnknown} and {@code defaultLanguageForUnspecified} to the same value. Will be copied
     * to each option if it is set to {@code undefined}.
     */
    defaultLanguage?: string;
    /**
     * Function which will be invoked when the specified/default language is not known to Prism. The function is passed the error message, the specified language and the set of available languages.
     */
    noKnownLanguageCallback?: any;
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
export default function markdownItPrism(markdownit: MarkdownIt, useroptions: Options): void;
export {};
