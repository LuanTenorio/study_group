import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/service/auth.service';
import { GroupService } from '../../group/service/group.service';
import { NoticeService } from '../service/notice.service';
import { CreateNotice, UpdateNotice } from '../interface/createNotice.interface';

@Component({
  selector: 'app-notice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './formNotice.component.html',
  styleUrl: './formNotice.component.scss'
})
export class NoticeFormComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly noticeService = inject(NoticeService);
  private readonly groupService = inject(GroupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  isEditMode = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(false);
  noticeId: number | null = null;
  groupId: number | null = null;
  userId: number | null = null;
  noticeForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const groupIdParam = params.get('groupId');
      const noticeIdParam = params.get('noticeId');

      this.groupId = groupIdParam ? Number(groupIdParam) : null;
      this.userId = this.authService.currentUser()?.id ?? null;

      if (noticeIdParam) {
        this.isEditMode.set(true);
        this.noticeId = Number(noticeIdParam);
        this.loadNoticeData(this.noticeId);
      } else {
        this.isEditMode.set(false);
        this.isLoading.set(false);
        this.noticeId = null;
        this.noticeForm.reset({ title: '', description: '', expiration_date: null });
      }
    });
  }

  private initForm(): void {
    this.noticeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      expiration_date: [null, [Validators.required]]
    });
  }

  private loadNoticeData(id: number): void {
    if (!this.groupId) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Grupo não encontrado.' });
      this.router.navigateByUrl('');
      return;
    }

    this.isLoading.set(true);
    this.groupService.findGroup(this.groupId).subscribe({
      next: (group) => {
        const notice = group.notices.find(item => item.id === id);

        if (!notice) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Aviso não encontrado.' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
          return;
        }

        this.noticeForm.patchValue({
          title: notice.title,
          description: notice.description,
          expiration_date: this.formatDateForInput(notice.expiration_date)
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do aviso.' });
        this.router.navigateByUrl('');
      }
    });
  }

  private formatDateForInput(value: Date | string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatDateForApi(value: unknown): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }

      const parsedDate = new Date(trimmed);
      if (!Number.isNaN(parsedDate.getTime())) {
        return this.formatDateForInput(parsedDate);
      }

      return null;
    }

    if (value instanceof Date) {
      return this.formatDateForInput(value);
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.noticeForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.noticeForm.invalid) {
      this.noticeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.noticeForm.value;
    const expirationDate = this.formatDateForApi(formValue.expiration_date);

    if (!expirationDate) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe uma data de vencimento válida.' });
      this.isSubmitting.set(false);
      return;
    }

    

    if (this.isEditMode() && this.noticeId) {
      const payload: UpdateNotice = {
        title: formValue.title,
        description: formValue.description,
        expiration_date: expirationDate,
        group_id: this.groupId ?? 0
      };
      this.noticeService.update(this.noticeId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aviso atualizado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    } else {
      const payload: CreateNotice = {
        title: formValue.title,
        description: formValue.description,
        expiration_date: expirationDate,
        group_id: this.groupId ?? 0,
        user_id: this.userId ?? 0
    };
      this.noticeService.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aviso criado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    }
  }

  private handleSubmittingError(error: HttpErrorResponse): void {
    this.isSubmitting.set(false);
    if (error.status === 409) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Já existe um aviso com esses dados.' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro interno', detail: 'Tente novamente mais tarde', life: 5000 });
    }
  }
}
