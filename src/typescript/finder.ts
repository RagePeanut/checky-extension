import { MentionOrigin } from './enums/mention_origin';
import { Mention } from './models/mention';

export class Finder {
    static readonly MENTION_REGEX: RegExp = /(^|[^\w=/#])@([a-z][a-z\d.-]*[a-z\d])/gimu;

    static findMentions(text: string, origin: MentionOrigin): Mention[] {
        const mentions: Mention[] = [];
        let match: RegExpExecArray = Finder.MENTION_REGEX.exec(text);
        while(match != null) {
            const username: string = match[2];
            // Testing for duplicates
            if(!mentions.some(mention => mention.username === username)) {
                const rawMention: string = match[0].substring(1);
                const mention: Mention = new Mention(rawMention, username, origin, Finder.findExtracts(rawMention, text));
                mentions.push(mention);
            }
            match = Finder.MENTION_REGEX.exec(text);
        }
        return mentions;
    }

    private static findExtracts(rawMention: string, text: string): string[] {
        const extractsRegex: RegExp = new RegExp('(?:\\S+\\s+){0,20}\\S*' + rawMention + '(?:[^a-zA-Z\d]\\S*(?:\\s+\\S+){0,20}|$)', 'g');
        return text.match(extractsRegex);
    }
}