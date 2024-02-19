export class UpdateUserDTO {
  id?: number;
  fullname: string;
  email: string;
  address: string;
  avatar_url: string;
  gender: boolean;
  createdDate?: Date;
  role_id: number = 7;


  constructor(data: any) {
    this.id = data.id;
    this.fullname = data.fullname;
    this.email = data.email;
    this.address = data.address;
    this.avatar_url = data.avatar_url;
    this.gender = data.gender;
    this.createdDate = data.createdDate;
    this.role_id = data.role_id || 7;

  }
}
