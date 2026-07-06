import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './auth/login/login.component';
import { AreaComponent } from './area/area.component';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
    { path: "auth/login", component: LoginComponent},
    { path: '',
        canActivate: [authGuard],
        children: [
            { path: '', component: FeedComponent },
            { path: 'area/:name', component: AreaComponent },
            { path: "group/:id", component: GroupComponent }
        ]
    }
];
