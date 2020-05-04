import { Client, ExtendedAccount } from '@hivechain/dhive';

export class Hive {
    static readonly hive: Client = new Client([
        "https://api.hive.blog",
        "https://api.hivekings.com",
        "https://anyx.io",
        "https://api.openhive.network"
    ]);

    static async getAccounts(usernames: string[]): Promise<ExtendedAccount[]> {
        return this.hive.database.getAccounts(usernames);
    }

    static formatReputation(reputation: string): number {
        const isNegative: boolean = reputation.charAt(0) === "-";
        if(isNegative) reputation = reputation.substring(1);
        const leadingDigits: number = parseInt(reputation.substring(0, 4));
        const log: number = Math.log(leadingDigits) / Math.log(10);
        let out: number = reputation.length - 1 + (log - parseInt(log + ""));
        if(isNaN(out)) out = 0;
        out = Math.max(out - 9, 0);
        if(isNegative) out = -out;
        out = out * 9 + 25;
        out = parseInt(out + "");
        return out;
    }
}