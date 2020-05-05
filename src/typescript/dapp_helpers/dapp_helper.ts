import * as $ from 'jquery';

import { Mention } from "../models/mention";
import { MentionOrigin } from "../enums/mention_origin";
import { Checker } from "../checker";
import { Finder } from "../finder";
import { HtmlHelper } from "../html_helper";

export abstract class DappHelper {
    protected button: JQuery<Node>;
    protected post: JQuery<Node>;
    protected title: JQuery<Node>;
    protected dappId: string;
    constructor(dappName: string) {
        this.dappId = "checky__" + dappName;
    }
    /**
     * Called on URL change to update the helper data and change the page at the new URL.
     * 
     * @param url The new URL
     */
    abstract onUrlChange(url: string): void;
    /**
     * Initializes the post edit page for the extension.
     * 
     * /!\ Needs to call replaceSubmitButton()
     */
    protected abstract initializeSubmitPage(): void;
    /**
     * Clones the submit button.
     */
    protected abstract cloneButton(): JQuery<Node>;
    /**
     * Replaces the submit button by a clone that will act as a middleman between the user
     * and the dapp. This allows the extension to perform its own tasks before the dapp.
     */
    protected replaceSubmitButton(buttonIdentifier: string): void {
        this.button = $(buttonIdentifier);
        const clone: JQuery<Node> = this.cloneButton();
        this.button.hide();
        clone.insertBefore(this.button);
        const observer: MutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if(mutation.attributeName === "disabled") {
                    clone.toggleClass("disabled", this.button.prop("disabled"));
                }
            });
        });
        observer.observe(this.button.get()[0], { attributes: true });
        clone.click(() => this.processPost());
    };
    /**
     * Processes the post, looking at its mentions and filtering the wrong ones. If any wrong
     * mention is found, calls showDialog(). Else, clicks on the dapp's submit button.
     */
    private async processPost(): Promise<void> {
        const mentions: Mention[] = Finder.findMentions(this.post.val() as string, MentionOrigin.POST);
        const wrongMentions: Mention[] = await Checker.filterWrongMentions(mentions);
        if(wrongMentions.length > 0) this.showDialog(wrongMentions);
        else this.button.click();
    }
    /**
     * Shows a dialog that lets the user pick what he would like to replace the wrong
     * mentions by.
     */
    private async showDialog(mentions: Mention[]): Promise<void> {
        const mentionsDialog: HTMLElement = await HtmlHelper.mentionsDialog(mentions, this.dappId, () => {
            mentions.forEach(mention => {
                const mentionRegex: RegExp = new RegExp([...mention.raw].join("|"), "g");
                this.post.val((_index, value) => value.replace(mentionRegex, "@" + mention.replacement));
            });
            this.post.get()[0].dispatchEvent(new Event("input", { bubbles: true }));
            this.button.click();
        });
        $("body").append(mentionsDialog);
    }
}