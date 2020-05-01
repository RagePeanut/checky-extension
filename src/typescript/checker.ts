import { Hive } from "./hive";
import { Mention } from "./models/mention";
import { ExtendedAccount } from "@hivechain/dhive";

export class Checker {
    static async filterWrongMentions(mentions: Mention[]): Promise<Mention[]> {
        const wrongMentions: Mention[] = [];
        for(let i = 0; i < mentions.length; i += 10000) {
            try {
                const slice: Mention[] = mentions.slice(i, i + 10000);
                const sliceUsernames: string[] = slice.map(mention => mention.mention);
                const accounts: ExtendedAccount[] = await Hive.getAccounts(sliceUsernames);
                for(let j = 0; j < slice.length; j++) {
                    if(!accounts[j]) wrongMentions.push(slice[j]);
                }
            } catch(e) {
                i -= 10000;
            }
        }
        return wrongMentions;
    }
}