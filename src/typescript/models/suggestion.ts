import { ExtendedAccount } from "@hivechain/dhive";
import { Hive } from "../hive";

export class Suggestion {
    readonly username: string;
    readonly reputation: number;

    constructor(account: ExtendedAccount) {
        this.username = account.name;
        this.reputation = Hive.formatReputation(account.reputation.toString());
    }
}