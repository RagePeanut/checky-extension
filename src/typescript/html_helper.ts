import * as $ from 'jquery';

import { Mention } from './models/mention';

export class HtmlHelper {
    private static _mentionsDialog: string;
    private static _mentionOverview: string;
    private static _mentionSuggestion: string;

    private static mentionIndex: number;

    static async init() {
        HtmlHelper._mentionsDialog = await $.get(chrome.runtime.getURL("html/mentions_dialog.html"));
        HtmlHelper._mentionOverview = await $.get(chrome.runtime.getURL("html/mention_overview.html"));
        HtmlHelper._mentionSuggestion = await $.get(chrome.runtime.getURL("html/mention_suggestion.html"));
    }

    static mentionsDialog(mentions: Mention[], onClose: VoidCallback): HTMLElement {
        HtmlHelper.mentionIndex = 0;
        const dialog: Node = $.parseHTML(HtmlHelper._mentionsDialog)[0];
        let mentionOverviewElt: HTMLElement = HtmlHelper.mentionOverview(mentions[0]);
        const jqDialog: JQuery<Node> = $(dialog);
        jqDialog.find("#checky__mentions-overview").append(mentionOverviewElt);

        jqDialog.find("#checky__previous-button").click(() => {
            if(HtmlHelper.mentionIndex > 0) {
                const focusedMention: Mention = mentions[--HtmlHelper.mentionIndex];
                const newMentionOverviewElt: HTMLElement = HtmlHelper.mentionOverview(focusedMention);
                $(mentionOverviewElt).replaceWith(newMentionOverviewElt);
                mentionOverviewElt = newMentionOverviewElt;
            }
        });

        jqDialog.find("#checky__next-button").click(() => {
            if(HtmlHelper.mentionIndex < mentions.length - 1) {
                const focusedMention: Mention = mentions[++HtmlHelper.mentionIndex];
                const newMentionOverviewElt: HTMLElement = HtmlHelper.mentionOverview(focusedMention);
                $(mentionOverviewElt).replaceWith(newMentionOverviewElt);
                mentionOverviewElt = newMentionOverviewElt;
            }
        });

        jqDialog.find("#checky__done-button").click(() => {
            jqDialog.remove();
            onClose()
        });

        // jqDialog actually represents the dark background, clicking it removes the dialog but doesn't trigger onClose
        jqDialog.click(event => {
            if(event.target === event.currentTarget) jqDialog.remove();
        });
        
        return dialog as HTMLElement;
    }

    private static mentionOverview(mention: Mention): HTMLElement {
        const overview: HTMLElement = $.parseHTML(HtmlHelper._mentionOverview.replace(/%mention%/g, mention.rawMention))[0] as HTMLElement;
        const select: HTMLElement = $("<select></select>").append(HtmlHelper.mentionSuggestions(mention.suggestions)).get()[0];
        overview.getElementsByClassName("checky__mention-overview-suggestions")[0].appendChild(select);
        // TODO: append extracts to overview
        return overview as HTMLElement;
    }

    private static mentionSuggestions(suggestions: string[]): HTMLElement[] {
        const options: string = suggestions.map(suggestion => HtmlHelper._mentionSuggestion.replace(/%suggestion%/g, suggestion)).join("");
        return $(options).get();
    }
}