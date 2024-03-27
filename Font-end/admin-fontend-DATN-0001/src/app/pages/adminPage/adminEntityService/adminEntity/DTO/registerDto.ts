
  export class RegisterDto {    
    fullname: string;     
    address: string;    
    password: string;      
    email: string;    
    retype_password: string;
    createdDate: Date;
    facebook_account_id: number = 0;
    google_account_id: number = 0;
    github_account_id: number = 0;
    role_id: number = 1;    
    avatar: string;
    constructor(data: any) {
      this.fullname = data.fullName;
      this.address = data.address;
      this.password = data.password;
      this.retype_password = data.retype_password;
      this.createdDate = data.createdDate;
      this.facebook_account_id = data.facebook_account_id || 0;
      this.google_account_id = data.google_account_id || 0;
      this.github_account_id = data.github_account_id || 0;
      this.role_id = data.role_id || 1;
      this.email = data.email;
      this.avatar = data.avatar;
    }
  }
  