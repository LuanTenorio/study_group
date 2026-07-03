import { Routes } from '@angular/router';
import { GroupComponent } from './group/group.component';
import { FeedComponent } from './feed/feed.component';

export const routes: Routes = [
    { path: '', component: FeedComponent },

    { path: "group/:id", component: GroupComponent },
];
