import { Dapp } from './typescript/enums/dapp';
import { Message } from './typescript/models/message';

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    if(changeInfo.status == "complete") {
        chrome.tabs.sendMessage(
            tabId,
            new Message(Dapp.HIVE_BLOG, tab.url)
        );
    }
});