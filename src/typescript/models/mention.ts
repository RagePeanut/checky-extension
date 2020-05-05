import { MentionOrigin } from '../enums/mention_origin';
import { Suggester } from '../suggester';
import { Finder } from "../finder";

export class Mention {
    readonly username: string;
    readonly raw: Set<string>;
    readonly origin: MentionOrigin;
    private _extracts: string[];
    readonly suggester: Suggester;
    replacement: string;

    constructor(raw: string, username: string, origin: MentionOrigin) {
        this.raw = new Set();
        this.raw.add(raw);
        this.username = username;
        this.origin = origin;
        this.suggester = new Suggester(username);
    }

    get extracts(): string[] {
        return this._extracts;
    }

    setExtracts(text: string): void {
        this._extracts = Finder.findExtracts(
            [...this.raw].sort((a, b) => a.length - b.length),
            text
        );
    }
}