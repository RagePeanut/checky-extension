export interface DappHelper {
    /**
     * Called on URL change to update the helper data and change the page at the new URL.
     * 
     * @param url The new URL
     */
    onUrlChange(url: string): void;
}