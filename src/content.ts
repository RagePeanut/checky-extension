import { HiveBlogHelper } from './typescript/dapp_helpers/hive_blog_helper';
import { Dapp } from './typescript/enums/dapp';
import { DappHelper } from './typescript/dapp_helpers/dapp_helper';
import { HtmlHelper } from './typescript/html_helper';
import { Message } from './typescript/models/message';
import { ResponseCallback } from './typescript/types';

const dappHelpers: Map<Dapp, DappHelper> = new Map([
    [Dapp.HIVE_BLOG, new HiveBlogHelper()]
]);

const parserInitialization: Promise<void> = HtmlHelper.init();

chrome.runtime.onMessage.addListener(async (message: Message, sender: chrome.runtime.MessageSender, sendResponse: ResponseCallback) => {
    await parserInitialization;
    const dappHelper: DappHelper = dappHelpers.get(message.dapp);
    dappHelper.onUrlChange(message.url);
});



