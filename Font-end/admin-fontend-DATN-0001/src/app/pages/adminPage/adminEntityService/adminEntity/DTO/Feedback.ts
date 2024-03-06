export class Feedback {
  email: string;
  reason: string;
  content: string;


  constructor(
    email: string = '',
    reason: string = '',
    content: string = '',
  ) {
    this.email = email;
    this.reason = reason;
    this.content = content;

  }
}
