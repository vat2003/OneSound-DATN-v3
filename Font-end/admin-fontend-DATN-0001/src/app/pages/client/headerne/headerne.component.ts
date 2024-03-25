import { Component, OnInit } from "@angular/core";
import { account } from "../../adminPage/adminEntityService/adminEntity/account/account";
import { LoginGoogleDto } from "../../adminPage/adminEntityService/adminEntity/DTO/LoginGoogleDto";
import { login } from "../../adminPage/adminEntityService/adminEntity/DTO/login";
import { accountServiceService } from "../../adminPage/adminEntityService/adminService/account-service.service";
import { TokenService } from "../../adminPage/adminEntityService/adminService/token.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginResponse } from "../../adminPage/adminEntityService/adminEntity/utils/login.response";

@Component({
  selector: 'app-headerne',
  standalone: true,
  imports: [],
  templateUrl: './headerne.component.html',
  styleUrl: './headerne.component.scss'
})
export class HeaderneComponent implements OnInit{
  account?: account | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  email: string = '';
googleInfoLogin: LoginGoogleDto = {
  email: '',
  picture: '',
  name: ''
};

loginDto: login = {
  email: '',
  password: '',

}
typeRequest: string ='';
idEmail: number = 0;
  avatar?: string = '';
  token: string = this.tokenService.getToken() ?? '';
  name: string = '';
  constructor(private userService: accountServiceService,
              private tokenService: TokenService,
              private route: ActivatedRoute,
              private router: Router
              ) {}

ngOnInit(): void {
    debugger;
    localStorage.removeItem('codewalker');
  this.route.queryParams.subscribe(params => {
    this.idEmail = params['id'];
    this.typeRequest = params['type'];
  });

  
  // console.log("DAY LA HEADER: "+this.idEmail+" "+this.typeRequest);
  if (this.typeRequest=="email"){
    this.userService.getGoogleUserInfo(this.idEmail).subscribe({
      next: (response: any) =>{
        this.email = response.email;
        this.avatar = response.picture;
        this.userService.checkEmailExists(this.email).subscribe({
          next: (clone: any) =>{
            if (clone.email==""||clone.email.length==0){
              this.router.navigate(['/users/update'], { queryParams: { id: this.idEmail, type: this.typeRequest }});
            } else {
              this.loginDto.email = this.email;
              this.loginDto.password = "09042006";
              this.userService.login(this.loginDto)
                .subscribe({
                    next: (response: LoginResponse) => {
                      debugger
                      const {token} = response
                      this.tokenService.setToken(token);
                      debugger;
                      this.userService.getUserDetail(token).subscribe({
                        next: (response: any) => {
                          this.account = {
                            ...response,
                          };

                          let avatarUrl = response.avatar;
                          let searchString = "https://lh3.googleusercontent.com";
                       
                          this.userService.saveUserResponseToLocalStorage(this.account ?? undefined);
                          if (this.account && this.account.accountRole) {
                            
                            alert(this.account.accountRole.name);
              
                            if (this.account.accountRole.name === 'admin') {
                              
                              this.router.navigate(['/onesound/admin']);
                            } else if (this.account.accountRole.name === 'user') {
                              
                              this.router.navigate(['/onesound/home/explore']);
                            }
                          } else {                              
                            alert('Error: User role information not found.');
                          }
                        },
                        complete: () => {
                          debugger
                        },
                        error: (error : any) => {
                          debugger
                        }
                      })
                    },
                    complete: () => {
                      debugger
                    },
                    error: (error : any) => {
                      debugger
                    }
                  }
                );
            }
          },
          complete: () =>{
            debugger;
          },
          error: (error: any) => {
            debugger;
            console.log("Error fetching data: "+error.error.message);
          }
        })
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) =>{
        debugger;
        console.log("Error fetching data: "+error.error.message);
      }
    })
  }
  this.account = this.userService.getUserResponseFromLocalStorage();
  this.userService.getUserDetail(this.token).subscribe({
    next: (response: any) =>{
      debugger;
      let avatarUrl = response.avatar;
      let searchString = "https://lh3.googleusercontent.com";
     
    },
    complete: () =>{
      debugger;
    },
    error: (error: any) =>{
      debugger;
      console.log("Error fetching data error: "+error.error.message);
    }
  })
  }

togglePopover(event: Event){
  event.preventDefault();
  this.isPopoverOpen = !this.isPopoverOpen;
}
handleItemClick(index: number){
  if (index===0){
    this.router.navigate(['/user-profile']);
  } else {
    if (index === 3) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.account = this.userService.getUserResponseFromLocalStorage();
      // this.cartService.clearCart();
    } else {
      if (index === 2){
        this.router.navigate(['/changes-password']);
      } else {
        if (index === 1){
          this.router.navigate(['/my-purchase']);
        }
      }
    }
  }
    this.isPopoverOpen = false;
}
setActiveNavItem(index: number){
  this.activeNavItem = index;
}
updateAccount(){

}
}
