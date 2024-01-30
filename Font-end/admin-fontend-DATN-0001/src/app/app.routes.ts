import {Routes} from '@angular/router';
import {SigninComponent} from "./pages/adminPage/signin/signin.component";
import {SignupComponent} from "./pages/adminPage/signup/signup.component";
import {BlankComponent} from "./pages/adminPage/blank/blank.component";
import {Notfound404Component} from "./pages/adminPage/notfound404/notfound404.component";
import {HomeComponent} from "./pages/adminPage/home/home.component";
import {ManagealbumAdminComponent} from "./pages/adminPage/manage/managealbum-admin/managealbum-admin.component";
import {ManageartistAdminComponent} from "./pages/adminPage/manage/manageartist-admin/manageartist-admin.component";
import {ManagegenreAdminComponent} from "./pages/adminPage/manage/managegenre-admin/managegenre-admin.component";
import {ManagesongAdminComponent} from "./pages/adminPage/manage/managesong-admin/managesong-admin.component";
import {ManageuserAdminComponent} from "./pages/adminPage/manage/manageuser-admin/manageuser-admin.component";
import {ChartComponent} from "./pages/adminPage/chart/chart.component";
import {ManageimageAdminComponent} from "./pages/adminPage/manage/manageimage-admin/manageimage-admin.component";
import {ForgotpasswordComponent} from "./pages/adminPage/forgotpassword/forgotpassword.component";
import {ChangePasswordComponent} from "./pages/adminPage/change-password/change-password.component";
import {UserMenusideComponent} from './pages/client/user-menuside/user-menuside.component';
import {UserExploreComponent} from './pages/client/user-explore/user-explore.component';
import {UserPlaysongComponent} from './pages/client/user-playsong/user-playsong.component';


export const routes: Routes = [
  {path: '', component: Notfound404Component},
  {path: 'onesound/signin', component: SigninComponent},
  {path: 'onesound/signup', component: SignupComponent},
  {path: 'onesound/forgotpassword', component: ForgotpasswordComponent},
  {path: 'onesound/admin/image', component: ManageimageAdminComponent},
  {path: 'update-genre/:id', component: ManagegenreAdminComponent},
  {path: 'update-singer/:id', component: ManageartistAdminComponent},
  {
    path: 'onesound/admin',
    component: HomeComponent,
    children: [
      {path: 'blank', component: BlankComponent},
      {path: '404', component: Notfound404Component},
      {path: 'manage/album', component: ManagealbumAdminComponent},
      {path: 'manage/artist', component: ManageartistAdminComponent},
      {path: 'manage/genre', component: ManagegenreAdminComponent},
      {
        path: 'manage/genre/update-genre/:id',
        component: ManagegenreAdminComponent,
      },
      {path: 'manage/genre/:id', component: ManagegenreAdminComponent},
      {path: 'manage/song', component: ManagesongAdminComponent},
      {path: 'manage/user', component: ManageuserAdminComponent},
      {path: 'chart', component: ChartComponent},
      {path: 'dashboard', component: BlankComponent},
    ],
  },
  {
    path: 'onesound/home',
    component: UserMenusideComponent,
    children: [
      {path: 'explore', component: UserExploreComponent},
      {path: 'playsong', component: UserPlaysongComponent},
    ],
  },
];
