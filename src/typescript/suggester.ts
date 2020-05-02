export class Suggester {
    static suggestUsernames(bases: string[]): string[] {
        // TODO: implement Peter Norvig's algorithm
        return bases.map(base => base + 1);
    }
}