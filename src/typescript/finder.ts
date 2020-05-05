import { MentionOrigin } from './enums/mention_origin';
import { Mention } from './models/mention';

export class Finder {
    private static readonly MENTION_REGEX: RegExp = /(^|[^\w=/#])@([a-z][a-z\d.-]*[a-z\d])/gimu;

    static findMentions(text: string, origin: MentionOrigin): Mention[] {
        const mentions: Mention[] = [];
        let match: RegExpExecArray = Finder.MENTION_REGEX.exec(text);
        while(match != null) {
            const username: string = match[2];
            // Testing for duplicates
            const matchingMention: Mention = mentions.find(mention => mention.username === username);
            // Removing the first char if it's not an @ char
            const rawMention: string = match[0][0] !== "@" ? match[0].substring(1) : match[0];
            if(matchingMention) matchingMention.raw.add(rawMention);
            else {
                const mention: Mention = new Mention(rawMention, username, origin);
                mentions.push(mention);
            }
            match = Finder.MENTION_REGEX.exec(text);
        }
        mentions.forEach(mention => mention.setExtracts(text));
        return mentions;
    }

    static findExtracts(rawMentions: string[], text: string): string[] {
        const extractsRegex: RegExp = new RegExp('(?:\\S+\\s+){0,20}\\S*' + rawMentions.join("|") + '(?:[^a-zA-Z\d]\\S*(?:\\s+\\S+){0,20}|$)', 'g');
        return text.match(extractsRegex);
    }
}