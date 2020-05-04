import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';
import { Suggestion } from './suggestion';

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

    async getSuggestions(): Promise<Suggestion[]> {
        return this.suggester.getSuggestions();
    };

    async getSuggestionsPlus(): Promise<Suggestion[]> {
        return this.suggester.getExtendedSuggestions();
    }
}