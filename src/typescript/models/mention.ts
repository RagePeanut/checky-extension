import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';

export class Mention {
    readonly username: string;
    readonly raw: string;
    readonly origin: MentionOrigin;
    readonly extracts: string[];
    private _suggestions: string[];
    private _suggestionsPlus: string[];

    constructor(raw: string, username: string, origin: MentionOrigin, extracts: string[]) {
        this.raw = raw;
        this.username = username;
        this.origin = origin;
        this.extracts = extracts;
    }

    get suggestions(): string[] {
        if(!this._suggestions) this._suggestions = Suggester.suggestUsernames([ this.username ]);
        return this._suggestions;
    };

    get suggestionsPlus(): string[] {
        if(!this._suggestionsPlus) this._suggestionsPlus = Suggester.suggestUsernames(this.suggestions);
        return this._suggestionsPlus;
    }
}