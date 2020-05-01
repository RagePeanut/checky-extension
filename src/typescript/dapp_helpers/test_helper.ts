import { Checker } from './../checker';
import * as $ from 'jquery';

import { DappHelper } from './dapp_helper';
import { Finder } from '../finder';
import { MentionOrigin } from '../enums/mention_origin';
import { Mention } from '../models/mention';

export class TestHelper implements DappHelper {
    private button: HTMLElement;
    private post: HTMLTextAreaElement;
    private title: HTMLInputElement;

    private initializeEditPage(): void {
        this.replaceButton();
        this.post = $('textarea')[0] as HTMLTextAreaElement;
        this.title = $('input')[0] as HTMLInputElement;
    }
    
    private replaceButton(): void {
        this.button = $('button')[0];
        const clone: HTMLElement = this.button.cloneNode(true) as HTMLElement;
        this.button.hidden = true;
        this.button.parentElement.insertBefore(clone, this.button);
        $(clone).click(() => this.onButtonClick());
    }

    private async onButtonClick(): Promise<void> {
        const mentions: Mention[] = Finder.findMentions(this.post.value, MentionOrigin.POST);
        const wrongMentions: Mention[] = await Checker.filterWrongMentions(mentions);
        console.log(wrongMentions);
        this.button.click();
    }

    onUrlChange(_url: string): void {
        this.initializeEditPage();
    }
}