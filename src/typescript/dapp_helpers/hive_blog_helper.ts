import * as $ from 'jquery';

import { DappHelper } from "./dapp_helper";

export class HiveBlogHelper extends DappHelper {
    constructor() {
        super("hive-blog");
    }

    protected initializeEditPage(): void {
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
    
    onUrlChange(_url: string): void {
        this.initializeEditPage();
    }
}