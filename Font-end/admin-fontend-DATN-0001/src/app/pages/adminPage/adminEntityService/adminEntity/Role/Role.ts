// role.model.ts
import { account } from '../account/account';

export class Role {
  id!: number;
  name: string;

  constructor(name: string = '', ) {
    this.name = name;
  }
}
