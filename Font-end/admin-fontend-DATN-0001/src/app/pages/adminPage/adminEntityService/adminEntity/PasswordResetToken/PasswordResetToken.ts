import { account } from "../account/account";

export class PasswordResetToken {
  id?: number;
  token: string;
  expiryDateTime: Date;

  constructor(
    token: string,
    expiryDateTime: Date,
    id?: number
  ) {
    this.token = token;
    this.expiryDateTime = expiryDateTime;
    this.id = id;
  }
}
