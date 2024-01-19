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
import {UserHomeComponentComponent} from "./pages/userPage/user-home-component/user-home-component.component";

export const routes: Routes = [
  {path: '', component: Notfound404Component},
  {path: 'onesound/admin/signin', component: SigninComponent},
  {path: 'onesound/admin/signup', component: SignupComponent},
  {path: 'onesound/admin/image', component: ManageimageAdminComponent},
  {
    path: 'onesound/admin', component: HomeComponent,
    children: [
      {path: 'blank', component: BlankComponent},
      {path: '404', component: Notfound404Component},
      {path: 'manage/album', component: ManagealbumAdminComponent},
      {path: 'manage/artist', component: ManageartistAdminComponent},
      {path: 'manage/genre', component: ManagegenreAdminComponent},
      {path: 'manage/song', component: ManagesongAdminComponent},
      {path: 'manage/user', component: ManageuserAdminComponent},
      {path: 'chart', component: ChartComponent},
      {path: 'dashboard', component: BlankComponent}
    ]
  },
  {path: 'onesound/home', component: UserHomeComponentComponent}


];
