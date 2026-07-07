import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Group } from '../group/interface/group.interface';
import { Meet } from './interface/meet.interface';

@Component({
  selector: 'app-meet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {
  groupId = 0;
  meetId = 0;
  meet: WritableSignal<Meet | undefined> = signal<Meet | undefined>(undefined);
  groupName = signal('');
  isLoading = signal(true);
  requestError = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading.set(true);
      this.requestError.set(false);

      this.groupId = Number(params.get('groupId'));
      this.meetId = Number(params.get('meetId'));

      if (!this.groupId || !this.meetId) {
        this.requestError.set(true);
        this.isLoading.set(false);
        return;
      }

      this.groupService.findGroup(this.groupId).subscribe({
        next: (groupData: Group) => {
          this.groupName.set(groupData.name);
          const found = groupData.meets.find(item => item.id === this.meetId);
          if (found) {
            this.meet.set(found);
          } else {
            this.requestError.set(true);
          }
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Erro ao carregar encontro:', err);
          this.requestError.set(true);
          this.isLoading.set(false);
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/group', this.groupId]);
  }
}
