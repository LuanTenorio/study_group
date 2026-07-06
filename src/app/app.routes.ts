import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './auth/login/login.component';
import { AreaComponent } from './area/area.component';
import { NoticeComponent } from './notice/notice.component';
import { MaterialComponent } from './material/material.component';
import { MeetComponent } from './meet/meet.component';

export const routes: Routes = [
    { path: '', component: FeedComponent },

    { path: 'area/:name', component: AreaComponent },

    { path: "group/:id", component: GroupComponent },
    { path: "group/:groupId/notice/:noticeId", component: NoticeComponent },
    { path: "group/:groupId/material/:materialId", component: MaterialComponent },
    { path: "group/:groupId/meet/:meetId", component: MeetComponent },
    { path: "auth/login", component: LoginComponent}
];
