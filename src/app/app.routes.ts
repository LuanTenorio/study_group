import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './auth/login/login.component';
import { AreaComponent } from './area/area.component';
import { FormGroupComponent } from './group/form/formGroup.component';
import { authGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
    { path: "auth/login", component: LoginComponent},
    { path: '',
        canActivate: [authGuard],
        children: [
            { path: "create-group", component: FormGroupComponent },
            { path: 'area/:name', component: AreaComponent },
            { path: "group/:id", component: GroupComponent },
            { path: '', component: FeedComponent }
        ]
    }
];
