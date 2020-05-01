import { MentionOrigin } from './enums/mention_origin';
import { Mention } from './models/mention';

export class Finder {
    static readonly MENTION_REGEX: RegExp = /(^|[^\w=/#])@([a-z][a-z\d.-]*[a-z\d])/gimu;

    static findMentions(text: string, origin: MentionOrigin): Mention[] {
        return (text.match(this.MENTION_REGEX) || []).map(rawMention => new Mention(rawMention, origin));
    }
}