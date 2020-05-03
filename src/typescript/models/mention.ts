import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';

export class Mention {
    readonly username: string;
    readonly raw: string;
    readonly origin: MentionOrigin;
    readonly extracts: string[];
    readonly suggester: Suggester;
    replacement: string;

    constructor(raw: string, username: string, origin: MentionOrigin, extracts: string[]) {
        this.raw = raw;
        this.username = username;
        this.origin = origin;
        this.extracts = extracts;
        this.suggester = new Suggester(username);
    }

    async getSuggestions(): Promise<string[]> {
        return this.suggester.getSuggestions();
    };

    async getSuggestionsPlus(): Promise<string[]> {
        return this.suggester.getExtendedSuggestions();
    }
}