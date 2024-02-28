export class Register {

    fullname: string;
    email: string;
    password: string;
    retype_password: string;
    createdDate: Date;
    birthday: Date;
    gender:boolean;
    active: boolean;
    role_id: number = 7;

    constructor(data: any) {
        this.fullname = data.fullname;
        this.email = data.email;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.gender = data.gender;
        this.createdDate = data.createdDate;
        this.birthday = data.birthday;
        this.active = data.active || false;
        this.role_id = data.role_id || 7;
    }
}
