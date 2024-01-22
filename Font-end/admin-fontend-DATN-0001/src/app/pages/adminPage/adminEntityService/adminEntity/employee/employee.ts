export class Employee {
  id!: number;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;

  constructor(
    firstName: string = '',
    lastName: string = '',
    emailId: string = '',
    phoneNumber: string = ''
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailId = emailId;
    this.phoneNumber = phoneNumber;
  }
}
