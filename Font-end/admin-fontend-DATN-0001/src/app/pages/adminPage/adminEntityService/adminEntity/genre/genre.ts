// import { IsNotEmpty } from 'class-validator';

// export class Genre {
//   id!: number;

 
//   name: string;
//   description: string;
//   image: string;



//   constructor(name: string = '', description: string = '', image: string = '',) {
//     this.name = name;
//     this.description = description;
//     this.image = image;

//   }
// }
export class Genre {
   
  id!: number;
  name: string = '';
  description: string = '';
  image: string = '';
  active: boolean = false;

  constructor() {
  }

}