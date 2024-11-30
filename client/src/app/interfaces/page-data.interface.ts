export class PageData {
    count: number;
    next: string;
    previous: string;
    results: any[];

    constructor() {
        this.count = 0;
        this.next = '';
        this.previous = '';
        this.results = [];
    }
}