import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { GroupService } from '../service/group.service';
import { GroupPreview } from '../interface/group_preview.interface';

@Component({
  selector: 'app-group-enroll',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule
  ],
  templateUrl: './enrollGroup.component.html',
  styleUrl: './enrollGroup.component.scss'
})
export class EnrollGroupComponent implements OnInit {

  private readonly messageService = inject(MessageService);
  private readonly groupService = inject(GroupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  groupId: number = 0;
  preview: WritableSignal<GroupPreview | undefined> = signal(undefined);
  requestError = signal(false);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.groupId = Number(params.get('id'));
      this.requestError.set(false);
      this.preview.set(undefined);

      this.groupService.findPreview(this.groupId).subscribe({
        next: data => this.preview.set(data),
        error: () => {
          this.requestError.set(true);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o grupo.', life: 5000 });
        }
      });
    });
  }

  onEnroll(): void {
    this.isSubmitting.set(true);

    this.groupService.enroll(this.groupId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Inscrito!', detail: 'Você agora faz parte deste grupo.', life: 4000 });
        this.router.navigate(['/group', this.groupId]);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (error.status === 409) {
          this.messageService.add({ severity: 'warn', summary: 'Já inscrito', detail: 'Você já é membro desse grupo.', life: 5000 });
          this.router.navigate(['/group', this.groupId]);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível concluir a inscrição.', life: 5000 });
        }
      }
    });
  }
}