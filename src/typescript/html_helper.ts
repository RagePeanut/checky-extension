import * as $ from 'jquery';

import { Mention } from './models/mention';

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
        const dialog: Node = $.parseHTML(HtmlHelper._dialog)[0];
        let overview: HTMLElement = await HtmlHelper.mentionOverview(mentions[0]);
        const jqDialog: JQuery<Node> = $(dialog);
        jqDialog.find("#checky__dialog-body").append(overview);

        jqDialog.find("#checky__previous").click(async () => {
            if(HtmlHelper.mentionIndex > 0) {
                const focusedMention: Mention = mentions[--HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });

        jqDialog.find("#checky__next").click(async () => {
            if(HtmlHelper.mentionIndex < mentions.length - 1) {
                const focusedMention: Mention = mentions[++HtmlHelper.mentionIndex];
                const newOverview: HTMLElement = await HtmlHelper.mentionOverview(focusedMention);
                $(overview).replaceWith(newOverview);
                overview = newOverview;
            }
        });

        jqDialog.find("#checky__done").click(() => {
            jqDialog.remove();
            onClose()
        });

        // jqDialog actually represents the dark background, clicking it removes the dialog but doesn't trigger onClose
        jqDialog.click(event => {
            if(event.target === event.currentTarget) jqDialog.remove();
        });
        
        return dialog as HTMLElement;
    }

    private static async mentionOverview(mention: Mention): Promise<HTMLElement> {
        const overview: HTMLElement = $.parseHTML(HtmlHelper._overview.replace(/%mention%/g, mention.raw))[0] as HTMLElement;
        const select: HTMLElement = $("<select></select>").append(HtmlHelper.mentionSuggestions(await mention.getSuggestions())).get()[0];
        $(overview).find("#checky__suggestions").append(select);
        $(overview).find("#checky__extracts").append(HtmlHelper.mentionExtracts(mention.extracts));
        return overview as HTMLElement;
    }

    private static mentionSuggestions(suggestions: string[]): HTMLElement[] {
        const options: string = suggestions.map(suggestion => HtmlHelper._suggestion.replace(/%suggestion%/g, suggestion))
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