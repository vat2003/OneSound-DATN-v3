import {RouterModule, Routes} from '@angular/router';

import {BlankComponent} from './pages/adminPage/blank/blank.component';
import {Notfound404Component} from './pages/adminPage/notfound404/notfound404.component';
import {HomeComponent} from './pages/adminPage/home/home.component';
import {ManagealbumAdminComponent} from './pages/adminPage/manage/managealbum-admin/managealbum-admin.component';
import {ManageartistAdminComponent} from './pages/adminPage/manage/manageartist-admin/manageartist-admin.component';
import {ManagegenreAdminComponent} from './pages/adminPage/manage/managegenre-admin/managegenre-admin.component';
import {ManagesongAdminComponent} from './pages/adminPage/manage/managesong-admin/managesong-admin.component';
import {ManageuserAdminComponent} from './pages/adminPage/manage/manageuser-admin/manageuser-admin.component';
import {ChartComponent} from './pages/adminPage/chart/chart.component';
import {ManageimageAdminComponent} from './pages/adminPage/manage/manageimage-admin/manageimage-admin.component';
import {ChangePasswordComponent} from './pages/adminPage/change-password/change-password.component';
import {ManageprofileAdminComponent} from './pages/adminPage/manage/manageprofile-admin/manageprofile-admin.component';
import {LoginneComponent} from './pages/adminPage/loginne/loginne.component';
import {DangkyComponent} from './pages/adminPage/dangky/dangky.component';
import {UserMenusideComponent} from './pages/client/user-menuside/user-menuside.component';
import {UserExploreComponent} from './pages/client/user-explore/user-explore.component';
import {UserPlaysongComponent} from './pages/client/user-playsong/user-playsong.component';
import {UserProfileComponent} from './pages/client/user-profile/user-profile.component';
import {ManageauthorComponent} from './pages/adminPage/manage/manageauthor-admin/manageauthor.component';
import {QuenmkComponent} from './pages/adminPage/quenmk/quenmk.component';
import {AdminGuardFn} from './guards/admin.guard';
import {AuthGuard, AuthGuardFn} from './guards/auth.guard';
import {SomeComponentComponent} from './pages/adminPage/some-component/some-component.component';
import {HistoryListensComponent} from './pages/client/history-listens/history-listens.component';
import {ProfileComponent} from './pages/adminPage/manage/profile/profile.component';
import {FeedbackComponent} from './pages/adminPage/manage/feedback/feedback.component';
import {CountAccessComponent} from './pages/adminPage/manage/statictical/count-access/count-access.component';
import {ReportComponent} from './pages/adminPage/manage/statictical/report/report.component';
import {StaticticalComponent} from './pages/adminPage/manage/statictical/statictical/statictical.component';
import {UserResultSearchComponent} from './pages/client/user-result-search/user-result-search.component';
import {UserplaylistComponent} from './pages/client/userplaylist/userplaylist.component';
import {UserFavoriteComponent} from './pages/client/user-favorite/user-favorite.component';
import {UserPlaylistFormComponent} from './pages/client/user-playlist-form/user-playlist-form.component';
import {UserSongInPlaylistComponent} from './pages/client/user-song-in-playlist/user-song-in-playlist.component';
import {
  PlayListSongComponent
} from './pages/client/play-list-song-form-play-list/play-list-song-form-play-list.component';
import {UserVipsongComponent} from './pages/client/user-vipsong/user-vipsong.component';
import {UserGenreComponent} from './pages/client/user-genre/user-genre.component';
import {UserGenredetailComponent} from './pages/client/user-genredetail/user-genredetail.component';
import {UpdateUserComponentComponent} from './pages/client/update-user-component/update-user-component.component';
import {UserPaymentComponent} from './pages/client/user-payment/user-payment.component';
import {ShareSocialComponent} from './pages/client/share-social/share-social.component';
import {TestCommentComponent} from './pages/client/test-comment/test-comment.component';

export const routes: Routes = [
  {path: '', component: UserExploreComponent},
  {path: 'onesound/signin', component: LoginneComponent},
  {path: 'onesound/signup', component: DangkyComponent},
  {path: 'onesound/dangnhap', component: LoginneComponent},
  {path: 'onesound/dangky', component: DangkyComponent},
  {path: 'onesound/changepassword/:id', component: ChangePasswordComponent},
  {path: 'onesound/forgotpassword', component: QuenmkComponent},
  {path: 'onesound/admin/image', component: ManageimageAdminComponent},
  {path: 'update-genre/:id', component: ManagegenreAdminComponent},
  {path: 'update-singer/:id', component: ManageartistAdminComponent},
  {path: 'oauth2/authorization/google', component: SomeComponentComponent},
  {path: 'onesound/profile', component: ProfileComponent},
  {path: 'onesound/feedback', component: FeedbackComponent},
  {
    path: 'onesound/admin',
    component: HomeComponent,
    canActivate: [AdminGuardFn],
    children: [
      {path: '', component: ReportComponent},
      {
        path: 'manage/statictical',
        component: StaticticalComponent,
        children: [
          {path: '', component: StaticticalComponent},
          {path: 'report', component: ReportComponent},
          {path: 'count-access', component: CountAccessComponent},
        ],
      },
    ],
  },
  {
    path: 'onesound/admin',
    canActivate: [AdminGuardFn],
    component: HomeComponent,
    children: [
      {path: 'blank', component: BlankComponent},
      {path: '404', component: Notfound404Component},
      {path: 'manage/genre/:id', component: ManagegenreAdminComponent},
      {path: 'manage/song', component: ManagesongAdminComponent},
      {path: 'manage/user', component: ManageuserAdminComponent},
      {path: 'chart', component: ChartComponent},
      {path: 'dashboard', component: BlankComponent},
      {path: 'manage/album', component: ManagealbumAdminComponent},
      {path: 'manage/artist', component: ManageartistAdminComponent},
      {path: 'manage/genre', component: ManagegenreAdminComponent},
      {path: 'manage/profile', component: ManageprofileAdminComponent},
      {path: 'manage/author', component: ManageauthorComponent},
      {
        path: 'manage/genre/update-genre/:id',
        component: ManagegenreAdminComponent,
      },
      {
        path: 'manage/genre/update-genre/:id',
        component: ManagegenreAdminComponent,
      },
    ],
  },
  {
    path: 'onesound/home',
    component: UserMenusideComponent,
    // canActivate: [AuthGuardFn],
    children: [
      {path: '', component: UserExploreComponent},
      {path: 'explore', component: UserExploreComponent},
      {path: 'vip', component: UserVipsongComponent},
      {path: 'genre', component: UserGenreComponent},
      {path: 'genre/:id', component: UserGenredetailComponent},
      {path: 'playsong', component: UserPlaysongComponent},
      {path: 'profile/:id', component: UserProfileComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'favorite', component: UserFavoriteComponent},
      {path: 'Playlists', component: UserplaylistComponent},
      {path: 'album/:id', component: UserPlaysongComponent},
      {path: 'user/playlist', component: UserPlaylistFormComponent},
      {path: 'user/playlist/:id', component: UserSongInPlaylistComponent},
      // {path: 'PlayListSong/:id', component: PlayListSongComponent},
      {path: 'PlayListSong/:id', component: PlayListSongComponent},
      {path: 'payment', component: UserPaymentComponent},
      {path: 'history-listen/:id', component: HistoryListensComponent},
    ],
  },
  {
    path: 'onesound/home',
    component: UserMenusideComponent,
    children: [
      {path: 'search/:keyword', component: UserResultSearchComponent},
      {path: 'feedback', component: FeedbackComponent},
      {path: 'users/update', component: UpdateUserComponentComponent},
      {path: 'share', component: ShareSocialComponent},
    ],
  },
];
export const AppRoutingModule = RouterModule.forRoot(routes);
