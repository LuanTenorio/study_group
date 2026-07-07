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

export const routes: Routes = [
    { path: '', component: FeedComponent },


    { path: 'my-groups', component: MyGroupsComponent },
    { path: 'area/:name', component: AreaComponent },

    { path: "group/:id", component: GroupComponent },
    { path: "group/:groupId/notice/:noticeId", component: NoticeComponent },
    { path: "group/:groupId/material/:materialId", component: MaterialComponent },
    { path: "group/:groupId/meet/:meetId", component: MeetComponent },
    { path: "auth/login", component: LoginComponent},
    { path: "auth/register", component: RegisterComponent},
    { path: '',
        canActivate: [authGuard],
        children: [
            { path: "create-group", component: FormGroupComponent },
            { path: "edit-group/:id", component: FormGroupComponent },
            { path: "group/:id/enroll", component: EnrollGroupComponent },
            { path: 'area/:name', component: AreaComponent },
            { path: "group/:id", component: GroupComponent },
            { path: "profile", component: ProfileComponent},
            { path: '', component: FeedComponent }
        ]
    }
]