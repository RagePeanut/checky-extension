import { ResponseCallback } from './typescript/types';
import { Dapp } from './typescript/enums/dapp';
import { DappHelper } from './typescript/dapp_helpers/dapp_helper';
import { TestHelper } from './typescript/dapp_helpers/test_helper';
import { Message } from './typescript/models/message';

const dappHelpers: Map<Dapp, DappHelper> = new Map([
    [Dapp.TEST, new TestHelper()]
]);

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse: ResponseCallback) => {
    const dappHelper: DappHelper = dappHelpers.get(message.dapp);
    dappHelper.onUrlChange(message.url);
});



