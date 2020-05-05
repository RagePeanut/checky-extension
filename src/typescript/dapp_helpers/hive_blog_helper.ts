import * as $ from 'jquery';

import { DappHelper } from "./dapp_helper";
import { Page } from "../enums/page";

export class HiveBlogHelper extends DappHelper {

    private static readonly SUBMIT_REGEX: RegExp = /hive\.blog\/submit\.html/;

    private currentPage: Page;

    constructor() {
        super("hive-blog");
    }

    protected initializeSubmitPage(): void {
        this.replaceSubmitButton("button[type=submit]");
        this.post = $(".ReplyEditor__body textarea");
        this.title = $(".ReplyEditor__title");
    }

    protected cloneButton(): JQuery<Node> {
        const clone: JQuery<Node> = $("<div class=\"button\"><span>" + this.button.text() + "</span></div>")
            .css({
                "margin-right": this.button.css("margin-right"),
                "font-family": this.button.css("font-family")
            });
        if(this.button.prop("disabled")) clone.addClass("disabled");
        return clone;
    }
    
    onUrlChange(url: string): void {
        if(HiveBlogHelper.SUBMIT_REGEX.test(url)) {
            if(this.currentPage !== Page.SUBMIT) {
                this.initializeSubmitPage();
            }
            this.currentPage = Page.SUBMIT;
        } else this.currentPage = Page.OTHER;
    }
}