export class Visit {
    visit!: number;
    date: Date;


    constructor(data: any) {
        this.visit = data.visit;
        this.date = new Date(data.date);
    }
}
