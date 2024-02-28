export class CountUserByDate {
    id!: number;
    createDate!: Date;

    constructor(data: any) {
        this.id = data.quantity || 0;
        this.createDate = new Date(data.create_date);
    }
}
