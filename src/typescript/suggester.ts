import { Checker } from "./checker";
import { Suggestion } from "./models/suggestion";

export class Suggester {
    private static readonly UNALLOWED_REGEX: RegExp = /(^|\.)[\d.-]|[.-](\.|$)|-{2}|.{17}|(^|\.).{0,2}(\.|$)/;
    private static readonly ALLOWED_CHARS: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','.','-'];
    
    private readonly _edits: Set<string>;
    private extendedEdits: Set<string>;
    private suggestions: Suggestion[];
    private extendedSuggestions: Suggestion[];
    private readonly suggestionsPromise: Promise<void>;

    constructor(base: string) {
        this._edits = new Set();
        this.suggestionsPromise = this.generateSuggestions(base);
    }

    get hasGeneratedExtendedSuggestions(): boolean {
        return this.extendedSuggestions !== undefined;
    }

    private async generateSuggestions(base: string): Promise<void> {
        this.edits(base, true);
        this.suggestions = await Checker.filterValidSuggestions([...this._edits]);
    }

    async getSuggestions(): Promise<Suggestion[]> {
        await this.suggestionsPromise;
        return this.suggestions;
    }

    async getExtendedSuggestions(): Promise<Suggestion[]> {
        if(!this.hasGeneratedExtendedSuggestions) {
            this.extendedEdits = new Set(this._edits);
            for(const edit of this._edits)
                this.edits(edit, false);
            this.extendedSuggestions = await Checker.filterValidSuggestions([...this.extendedEdits]);
        }
        return this.extendedSuggestions;
    }

    private edits(base: string, isFirstEdit: boolean): void {
        this.deletes(base, isFirstEdit);
        this.inserts(base, isFirstEdit);
        this.replaces(base, isFirstEdit);
        this.transposes(base, isFirstEdit);
    }

    private deletes(base: string, isFirstEdit: boolean): void {
        for(let i = 0; i < base.length; i++) {
            const del: string = base.substr(0, i) + base.substr(i + 1, base.length);
            this.addToSets(del, isFirstEdit);
        }
    }

    private inserts(base: string, isFirstEdit: boolean): void {
        for(let i = 0; i < base.length; i++) {
            const baseStart: string = base.substr(0, i);
            const baseEnd: string = base.substr(i, base.length);
            for(let j = 0; j < Suggester.ALLOWED_CHARS.length; j++) {
                const insert: string = baseStart + Suggester.ALLOWED_CHARS[j] + baseEnd;
                this.addToSets(insert, isFirstEdit);
            }
        }
    }

    private replaces(base: string, isFirstEdit: boolean): void {
        for(let i = 0; i < base.length; i++) {
            const baseStart: string = base.substr(0, i);
            const baseEnd: string = base.substr(i + 1, base.length);
            for(let j = 0; j < Suggester.ALLOWED_CHARS.length; j++) {
                const replace: string = baseStart + Suggester.ALLOWED_CHARS[j] + baseEnd;
                this.addToSets(replace, isFirstEdit);
            }
        }
    }

    private transposes(base: string, isFirstEdit: boolean): void {
        for(let i = 0; i < base.length; i++) {
            if(base[i] != base[i + 1]) {
                const splits: string[] = base.split("");
                splits[i] = base[i + 1];
                splits[i + 1] = base[i];
                const transpose: string = splits.join("");
                this.addToSets(transpose, isFirstEdit);
            }
        }
    }

    private addToSets(edit: string, isFirstEdit: boolean) {
        if(isFirstEdit) this._edits.add(edit);
        else if(!Suggester.UNALLOWED_REGEX.test(edit)) this.extendedEdits.add(edit);
    }
}