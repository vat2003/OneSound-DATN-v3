import { PasswordResetToken } from "../PasswordResetToken/PasswordResetToken";
import { Role } from "../Role/Role";

export class account{
  id?: number;
  password: string;
  fullname: string;
  email: string;
  active:boolean;
  createdDate?: Date;
  address: string;
  avatar_url: string;
  gender:boolean;

  birthday?:Date;
  phonenumber:string;

  // ... các trường khác
  accountRole?: Role;
  passwordResetToken?: PasswordResetToken;

  constructor(
    password: string = '',
    fullname: string = '',
    email: string,
    active: boolean = true,
    address: string = '',
    avatar_url: string = '',
    gender: boolean = false,
    createdDate?: Date,
    birthday?: Date,
    phonenumber: string = '',
    accountRole?: Role,
    passwordResetToken?: PasswordResetToken,
  ) {
    // Initialize all properties
    this.password = password;
    this.fullname = fullname;
    this.email = email;
    this.active = active;
    this.address = address;
    this.avatar_url = avatar_url;
    this.gender = gender;
    this.createdDate = createdDate ?? new Date();
    this.birthday = birthday ?? new Date();
    this.phonenumber = phonenumber;
    this.accountRole = accountRole;
    this.passwordResetToken = passwordResetToken;

  }


}
export function createAccount(
  accountData: Partial<account> = {}
): account {
  const {
    password = '',
    fullname = '',
    email='',
    active = true,
    address = '',
    avatar_url = '',
    gender = false,
    createdDate,
    birthday,
    phonenumber = '',
    accountRole,
    passwordResetToken,
  } = accountData;

  // Xác thực email và password trước khi khởi tạo


  return new account(password, fullname, email, active, address, avatar_url, gender, createdDate, birthday, phonenumber, accountRole, passwordResetToken);
}

