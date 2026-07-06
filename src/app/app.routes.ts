import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AreaComponent } from './area/area.component';
import { ProfileComponent } from './user/profile/profile.component';
import { MyGroupsComponent } from './mygroups.component/mygroups.component';

export const routes: Routes = [
    { path: '', component: FeedComponent },


    { path: 'my-groups', component: MyGroupsComponent },
    { path: 'area/:name', component: AreaComponent },

    { path: "group/:id", component: GroupComponent },
    { path: "auth/login", component: LoginComponent},
    { path: "auth/register", component: RegisterComponent},
    { path: "profile", component: ProfileComponent}
];
