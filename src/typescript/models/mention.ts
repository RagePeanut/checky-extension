import { MentionOrigin } from './../enums/mention_origin';

export class Mention {
    readonly mention: string;
    readonly rawMention: string;
    readonly origin: MentionOrigin;

    constructor(rawMention: string, origin: MentionOrigin) {
        this.rawMention = rawMention.trim();
        const splits: string[] = rawMention.split("@");
        this.mention = splits[splits.length - 1].toLowerCase();
        this.origin = origin;
    }
}