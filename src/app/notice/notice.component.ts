import { Component, OnInit, signal, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Notice } from './interface/notice.interface';
import { Group } from '../group/interface/group.interface';
import { NoticeService } from './service/notice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  groupId = 0;
  noticeId = 0;
  notice: WritableSignal<Notice | undefined> = signal<Notice | undefined>(undefined);
  group: WritableSignal<Group | undefined> = signal<Group | undefined>(undefined);
  groupName = signal('');
  isLoading = signal(true);
  requestError = signal(false);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly groupService: GroupService,
    private readonly noticeService: NoticeService
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
          this.group.set(groupData);
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

  deleteNotice() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar este aviso? Esta ação não pode ser desfeita.',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => this.deleteConfirmed(),
    });
  }

  private deleteConfirmed(){
    const noticeId = this.notice()?.id ?? this.noticeId;

    this.noticeService.delete(noticeId, this.groupId).subscribe({
      next: () => this.router.navigateByUrl("/group/" + this.groupId),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar aviso', life: 5000 })
    })
  }

  goBack(): void {
    this.router.navigate(['/group', this.groupId]);
  }

  editNotice() {
    this.router.navigate(['/group', this.groupId, 'notice', 'edit', this.noticeId]);
  }

}
