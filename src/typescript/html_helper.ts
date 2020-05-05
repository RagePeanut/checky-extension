import * as $ from 'jquery';

import { Mention } from './models/mention';
import { Suggestion } from './models/suggestion';
import { Suggester } from './suggester';

export class HtmlHelper {
    private static _dialog: string;
    private static _overview: string;
    private static _suggestion: string;
    private static _extract: string;
    private static _moreSuggestions: string;

    private static mentionIndex: number;

    static async init() {
        [ HtmlHelper._dialog, HtmlHelper._overview, HtmlHelper._suggestion, HtmlHelper._extract, HtmlHelper._moreSuggestions ] = await Promise.all([
            $.get(chrome.runtime.getURL("html/mentions_dialog.html")),
            $.get(chrome.runtime.getURL("html/mention_overview.html")),
            $.get(chrome.runtime.getURL("html/mention_suggestion.html")),
            $.get(chrome.runtime.getURL("html/mention_extract.html")),
            $.get(chrome.runtime.getURL("html/mention_more-suggestions.html"))
        ]);
    }

    static async mentionsDialog(mentions: Mention[], dappId: string, onDone: VoidCallback): Promise<HTMLElement> {
        HtmlHelper.mentionIndex = 0;
        const jqDialog: JQuery<Node> = $($.parseHTML(HtmlHelper._dialog.replace(/%dapp_id%/g, dappId))[0]);
        let overview: HTMLElement = await HtmlHelper.mentionOverview(mentions[0], jqDialog);
        jqDialog.find("#checky__dialog-body").append(overview);
        
        // Previous button
        jqDialog.find("#checky__previous").click(async () => {
            if(HtmlHelper.mentionIndex > 0) {
                const focusedMention: Mention = mentions[--HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention, jqDialog);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });
        // Next button
        jqDialog.find("#checky__next").click(async () => {
            if(HtmlHelper.mentionIndex < mentions.length - 1) {
                const focusedMention: Mention = mentions[++HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention, jqDialog);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });
        // Done button
        jqDialog.find("#checky__done").click(() => {
            jqDialog.remove();
            onDone();
        });

        // jqDialog actually represents the dark background, clicking it removes the dialog but doesn't trigger onDone
        jqDialog.click(event => {
            if(event.target === event.currentTarget) jqDialog.remove();
        });
        jqDialog.find(".close-button").click(event => {
            if(event.target === event.currentTarget) jqDialog.remove();
        });
        
        return jqDialog.get()[0] as HTMLElement;
    }

    private static async mentionOverview(mention: Mention, jqDialog: JQuery<Node>): Promise<HTMLElement> {
        const overview: JQuery<Node> = $($.parseHTML(HtmlHelper._overview.replace(/%mention%/g, mention.username))[0]);

        const suggestions: JQuery<Node> = overview.find("#checky__suggestions");
        const replaceInput: JQuery<Node> = overview.find("#checky__replace > input");
        await HtmlHelper.setSuggestions(mention.suggester, suggestions, function() {
            mention.replacement = $(this).find("input").val().toString();
            replaceInput.val(mention.replacement);
            suggestions.css("display", "none");
        });

        HtmlHelper.setExtracts(mention.extracts, mention, overview.find("#checky__extracts"));

        jqDialog.mousedown(event => {
            if(!$(event.target).hasClass("checky__replace-interactable"))
                suggestions.css("display", "none");
        });

        replaceInput.click(() => suggestions.css("display", "block"))
                    .on("input", () => {
                        mention.replacement = replaceInput.val() as string;
                        const lcReplacement = mention.replacement.toLowerCase();
                        overview.find(".checky__suggestion").each(function() {
                            const suggestion: JQuery<Node> = $(this);
                            const containsInput: boolean = suggestion.find("input").val().toString().includes(lcReplacement);
                            suggestion.css("display", containsInput ? "flex" : "none");
                        });
                    });

        return overview.get()[0] as HTMLElement;
    }

    private static async setSuggestions(suggester: Suggester, parent: JQuery<Node>, onSuggestionClick: VoidCallback): Promise<void> {
        const suggestions: Suggestion[] = suggester.hasGeneratedExtendedSuggestions ? await suggester.getExtendedSuggestions()
                                                                                    : await suggester.getSuggestions();
        let options: string = suggestions.map(suggestion => HtmlHelper._suggestion.replace(/%suggestion%/g, suggestion.username)
                                                                                  .replace(/%reputation%/g, suggestion.reputation.toString()))
                                         .join("");
        if(!suggester.hasGeneratedExtendedSuggestions) options += this._moreSuggestions;
        parent.html(options);
        parent.find(".checky__suggestion").click(onSuggestionClick);
        if(!suggester.hasGeneratedExtendedSuggestions) {
            parent.find("#checky__more-suggestions").click(async function() {
                $(this).text("Generating more suggestions...");
                await suggester.getExtendedSuggestions();
                HtmlHelper.setSuggestions(suggester, parent, onSuggestionClick);
            });
        }
    }

    private static setExtracts(extracts: string[], mention: Mention, parent: JQuery<Node>): void {
        const rawMentionRegex: RegExp = new RegExp([...mention.raw].join("|"), "g");
        const divs: string = extracts.map((extract, index) => HtmlHelper._extract.replace(/%extract_number%/g, (index + 1).toString())
                                                                                 .replace(/%extract%/g, extract)
                                                                                 .replace(rawMentionRegex, (matched) => "<strong>" + matched + "</strong>"))
                                     .join("");
        parent.html(divs);
    }
}