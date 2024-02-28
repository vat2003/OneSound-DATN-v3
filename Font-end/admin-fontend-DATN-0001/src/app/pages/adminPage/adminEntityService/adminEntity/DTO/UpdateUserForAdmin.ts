import { Role } from "../Role/Role";

// export class UpdateUserForAdmin {
//     // id?: number;
//     fullname: string;
//     email: string;
//     address: string;
//     Phone: string;
//     avatar_url: string;
//     gender: boolean;
//     createdDate?: Date;
//     password: string;
//     accountRole?: Role;

//     constructor(data: any) {
//         // this.id = data.id;
//         this.fullname = data.fullname;
//         this.email = data.email;
//         this.Phone = data.Phone;
//         this.address = data.address;
//         this.avatar_url = data.avatar_url;
//         this.gender = data.gender;
//         this.password = data.password;
//         this.createdDate = data.createdDate;
//         this.accountRole = data.accountRole;
//     }
// }

export class UpdateUserForAdmin {
    id?: number;
    fullname: string;
    email: string;
    address: string;
    Phone: string;
    avatar_url: string;
    gender: boolean;
    createdDate?: string; // Change the type to string
    password: string;
    active!:boolean;
    accountRole?: Role;
    birthday: Date;

    constructor(data: any) {
      this.id = data.id;
      this.fullname = data.fullname;
      this.email = data.email;
      this.Phone = data.Phone;
      this.address = data.address;
      this.avatar_url = data.avatar_url;
      this.gender = data.gender;
      this.password = data.password;
      this.createdDate = data.createdDate; // Keep it as is, assuming it's a string from backend
      this.accountRole = data.accountRole;
      this.active = data.active;
      this.birthday = data.birthday;
    }
  }
