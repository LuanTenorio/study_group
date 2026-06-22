import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';

export const routes: Routes = [
    { path: "group/:id", component: GroupComponent },
];
