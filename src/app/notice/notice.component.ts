import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Notice } from './interface/notice.interface';
import { Group } from '../group/interface/group.interface';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  groupId = 0;
  noticeId = 0;
  notice: WritableSignal<Notice | undefined> = signal<Notice | undefined>(undefined);
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
      this.noticeId = Number(params.get('noticeId'));

      if (!this.groupId || !this.noticeId) {
        this.requestError.set(true);
        this.isLoading.set(false);
        return;
      }

      this.groupService.findGroup(this.groupId).subscribe({
        next: (groupData: Group) => {
          this.groupName.set(groupData.name);

          const notice = groupData.notices.find(item => item.id === this.noticeId);
          if (notice) {
            this.notice.set(notice);
          } else {
            this.requestError.set(true);
          }
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Erro ao carregar aviso:', err);
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
