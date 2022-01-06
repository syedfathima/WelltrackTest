export class MultiAutoItem {
    constructor(public id: number, public item: string, public selected?: boolean) {
        if (selected === undefined) selected = false;
    }
}