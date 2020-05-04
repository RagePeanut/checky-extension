import * as $ from 'jquery';

import { Mention } from './models/mention';
import { Suggestion } from './models/suggestion';

export class HtmlHelper {
    private static _dialog: string;
    private static _overview: string;
    private static _suggestion: string;
    private static _extract: string;

    private static mentionIndex: number;

    static async init() {
        HtmlHelper._dialog = await $.get(chrome.runtime.getURL("html/mentions_dialog.html"));
        HtmlHelper._overview = await $.get(chrome.runtime.getURL("html/mention_overview.html"));
        HtmlHelper._suggestion = await $.get(chrome.runtime.getURL("html/mention_suggestion.html"));
        HtmlHelper._extract = await $.get(chrome.runtime.getURL("html/mention_extract.html"));
    }

    static async mentionsDialog(mentions: Mention[], onClose: VoidCallback): Promise<HTMLElement> {
        HtmlHelper.mentionIndex = 0;
        const jqDialog: JQuery<Node> = $($.parseHTML(HtmlHelper._dialog)[0]);
        let overview: HTMLElement = await HtmlHelper.mentionOverview(mentions[0], jqDialog);
        jqDialog.find("#checky__dialog-body").append(overview);

        jqDialog.find("#checky__previous").click(async () => {
            if(HtmlHelper.mentionIndex > 0) {
                const focusedMention: Mention = mentions[--HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention, jqDialog);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });

        jqDialog.find("#checky__next").click(async () => {
            if(HtmlHelper.mentionIndex < mentions.length - 1) {
                const focusedMention: Mention = mentions[++HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention, jqDialog);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });

        jqDialog.find("#checky__done").click(() => {
            jqDialog.remove();
            onClose();
        });

        // jqDialog actually represents the dark background, clicking it removes the dialog but doesn't trigger onClose
        jqDialog.click(event => {
            if(event.target === event.currentTarget) jqDialog.remove();
        });
        
        return jqDialog.get()[0] as HTMLElement;
    }

    private static async mentionOverview(mention: Mention, jqDialog: JQuery<Node>): Promise<HTMLElement> {
        const overview: JQuery<Node> = $($.parseHTML(HtmlHelper._overview.replace(/%mention%/g, mention.username))[0]);
        overview.find("#checky__suggestions").append(HtmlHelper.mentionSuggestions(await mention.getSuggestions()));
        overview.find("#checky__extracts").append(HtmlHelper.mentionExtracts(mention.extracts));

        const suggestionsContainer: JQuery<Node> = overview.find("#checky__suggestions");
        jqDialog.mousedown(event => {
            if(!$(event.target).hasClass("checky__replace-interactable"))
                suggestionsContainer.css("display", "none");
        });

        const replaceInput: JQuery<Node> = overview.find("#checky__replace > input");
        const suggestions: JQuery<Node> = overview.find(".checky__suggestion");
        suggestions.click(function() {
            mention.replacement = $(this).find("input").val().toString();
            replaceInput.val(mention.replacement);
            suggestionsContainer.css("display", "none");
        });

        replaceInput.click(() => suggestionsContainer.css("display", "block"))
                    .on("input", () => {
                        mention.replacement = replaceInput.val() as string;
                        const lcReplacement = mention.replacement.toLowerCase();
                        suggestions.each(function() {
                            const suggestion: JQuery<Node> = $(this);
                            const containsInput: boolean = suggestion.find("input").val().toString().includes(lcReplacement);
                            suggestion.css("display", containsInput ? "flex" : "none");
                        });
                    });

        return overview.get()[0] as HTMLElement;
    }

    private static mentionSuggestions(suggestions: Suggestion[]): HTMLElement[] {
        const options: string = suggestions.map(suggestion => HtmlHelper._suggestion.replace(/%suggestion%/g, suggestion.username)
                                                                                    .replace(/%reputation%/g, suggestion.reputation.toString()))
                                           .join("");
        return $(options).get();
    }

    private static mentionExtracts(extracts: string[]): HTMLElement[] {
        const divs: string = extracts.map((extract, index) => HtmlHelper._extract.replace(/%extract_number%/g, (index + 1).toString())
                                                                                 .replace(/%extract%/g, extract))
                                     .join("");
        return $(divs).get();
    }
}