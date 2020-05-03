import { Hive } from "./hive";
import { Mention } from "./models/mention";
import { ExtendedAccount } from "@hivechain/dhive";

export class Checker {
    static async filterWrongMentions(mentions: Mention[]): Promise<Mention[]> {
        const wrongMentions: Mention[] = [];
        for(let i = 0; i < mentions.length; i += 10000) {
            try {
                const slice: Mention[] = mentions.slice(i, i + 10000);
                const sliceUsernames: string[] = slice.map(mention => mention.username);
                const accounts: ExtendedAccount[] = await Hive.getAccounts(sliceUsernames);
                for(let j = 0; j < slice.length; j++) {
                    if(!accounts[j]) wrongMentions.push(slice[j]);
                }
            } catch(e) {
                // Handles API not working
                i -= 10000;
            }
        }
        return wrongMentions;
    }

    static async filterValidUsernames(usernames: string[]): Promise<string[]> {
        const valid: string[] = [];
        for(let i = 0; i < usernames.length; i += 10000) {
            try {
                const slice: string[] = usernames.slice(i, i + 10000);
                const accounts: ExtendedAccount[] = await Hive.getAccounts(slice);
                for(let j = 0; j < slice.length; j++) {
                    if(accounts[j]) valid.push(accounts[j].name);
                }
            } catch(e) {
                // Handles API not working
                i -= 10000;
            }
        }
        return valid;
    }
}