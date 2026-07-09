import { Component, OnInit, signal, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Group } from '../group/interface/group.interface';
import { Meet } from './interface/meet.interface';
import { MeetService } from './service/meet.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-meet',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit {
  groupId = 0;
  meetId = 0;
  meet: WritableSignal<Meet | undefined> = signal<Meet | undefined>(undefined);
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
    private readonly meetService: MeetService
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
          this.group.set(groupData);
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

  editMeet() {
    this.router.navigate(['/group', this.groupId, 'meet', 'edit', this.meetId]);
  }

  creatorName(): string {
    const meet = this.meet();

    if (meet?.user?.name) {
      return meet.user.name;
    }

    return meet?.user_id ? `Usuário #${meet.user_id}` : 'Não informado';
  }

  deleteMeet() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar este encontro? Esta ação não pode ser desfeita.',
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
    const meetId = this.meet()?.id ?? this.meetId;

    this.meetService.delete(meetId, this.groupId).subscribe({
      next: () => this.router.navigateByUrl("/group/" + this.groupId),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar encontro', life: 5000 })
    })
  }
}
