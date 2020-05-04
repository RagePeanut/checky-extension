import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';

export class Mention {
    readonly username: string;
    readonly raw: Set<string>;
    readonly origin: MentionOrigin;
    readonly extracts: string[];
    readonly suggester: Suggester;
    replacement: string;

    constructor(raw: string, username: string, origin: MentionOrigin, extracts: string[]) {
        this.raw = new Set();
        this.raw.add(raw);
        this.username = username;
        this.origin = origin;
        this.extracts = extracts;
        this.suggester = new Suggester(username);
    }
}