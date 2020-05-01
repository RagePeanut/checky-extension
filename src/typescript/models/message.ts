import { Dapp } from "../enums/dapp";

export class Message {
    readonly dapp: Dapp;
    readonly url: string;

    constructor(dapp: Dapp, url: string) {
        this.dapp = dapp;
        this.url = url;
    }
}