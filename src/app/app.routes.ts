import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AreaComponent } from './area/area.component';
import { FormGroupComponent } from './group/form/formGroup.component';
import { authGuard } from './auth/guard/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { NoticeComponent } from './notice/notice.component';
import { MaterialComponent } from './material/material.component';
import { MeetComponent } from './meet/meet.component';
import { MyGroupsComponent } from './mygroups/mygroups.component';
import { EnrollGroupComponent } from './group/enrollgroup/enrollgroup.component';
import { NoticeFormComponent } from './notice/form/formNotice.component';
import { MaterialFormComponent } from './material/form/formMaterial.component';
import { MeetFormComponent } from './meet/form/formMeet.component';

export const routes: Routes = [
    { path: '', component: FeedComponent },


    { path: 'area/:name', component: AreaComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    
    
    { path: '', canActivate: [authGuard], children: [
        { path: 'create-group', component: FormGroupComponent },
        { path: 'edit-group/:id', component: FormGroupComponent },
        { path: 'my-groups', component: MyGroupsComponent },
        { path: 'group/:groupId/notice/create', component: NoticeFormComponent },
        { path: 'group/:groupId/notice/edit/:noticeId', component: NoticeFormComponent },
        { path: 'group/:groupId/notice/:noticeId', component: NoticeComponent },
        { path: 'group/:groupId/material/create', component: MaterialFormComponent },
        { path: 'group/:groupId/material/edit/:materialId', component: MaterialFormComponent },
        { path: 'group/:groupId/material/:materialId', component: MaterialComponent },
        { path: 'group/:groupId/meet/create', component: MeetFormComponent },
        { path: 'group/:groupId/meet/edit/:meetId', component: MeetFormComponent },
        { path: 'group/:groupId/meet/:meetId', component: MeetComponent },
        { path: 'group/:id', component: GroupComponent },
        { path: 'profile', component: ProfileComponent },
        { path: '', component: FeedComponent },
        { path: "create-group", component: FormGroupComponent },
        { path: "edit-group/:id", component: FormGroupComponent },
        { path: "group/:id/enroll", component: EnrollGroupComponent },
        { path: 'area/:name', component: AreaComponent },
        { path: "group/:id", component: GroupComponent },
        { path: "profile", component: ProfileComponent},
        { path: '', component: FeedComponent }
    ]}
]
