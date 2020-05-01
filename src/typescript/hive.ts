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
}