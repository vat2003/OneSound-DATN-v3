export class Register {

    fullname: string;
    email: string;
    password: string;
    retype_password: string;
    createdDate: Date;
    active: boolean;
    role_id: number = 7;
    
    constructor(data: any) {
        this.fullname = data.fullname;
        this.email = data.email;
        this.password = data.password;
        this.retype_password = data.retype_password;
        this.createdDate = data.date_of_birth;
        this.active = data.active || false;  // Set to false if not provided
        this.role_id = data.role_id || 7;
    }
}
