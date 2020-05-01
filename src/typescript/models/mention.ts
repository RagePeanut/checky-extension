import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';

export class Mention {
    readonly mention: string;
    readonly rawMention: string;
    readonly origin: MentionOrigin;
    private _suggestions: string[];
    private _suggestionsPlus: string[];

    constructor(rawMention: string, origin: MentionOrigin) {
        this.rawMention = rawMention.trim();
        const splits: string[] = rawMention.split("@");
        this.mention = splits[splits.length - 1].toLowerCase();
        this.origin = origin;
    }

    get suggestions(): string[] {
        return this._suggestions || Suggester.suggestUsernames([ this.mention ]);
    };

    get suggestionsPlus(): string[] {
        return this._suggestionsPlus || Suggester.suggestUsernames(this.suggestions);
    }
}