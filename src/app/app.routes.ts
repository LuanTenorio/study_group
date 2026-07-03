import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: "group/:id", component: GroupComponent },
    { path: "auth/login", component: LoginComponent}
];
