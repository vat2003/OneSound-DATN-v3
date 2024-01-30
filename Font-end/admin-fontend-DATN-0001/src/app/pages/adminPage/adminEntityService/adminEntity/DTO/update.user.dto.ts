export class UpdateUserDTO {
    fullname: string;    
    address: string;    
    password: string;    
    createdDate: Date;    
    
    constructor(data: any) {
        this.fullname = data.fullname;
        this.address = data.address;
        this.password = data.password;
        this.createdDate = data.createdDate;        
    }
}