import { PasswordResetToken } from "../PasswordResetToken/PasswordResetToken";
import { Role } from "../Role/Role";

export interface account{
  id?: number;
  password: string;
  fullname: string;
  email: string;
  active:boolean;
  address: string;
  avatar_url: string;
  gender:boolean;
  createdDate?: Date;
  accountRole?: Role;
  passwordResetToken?: PasswordResetToken;

}