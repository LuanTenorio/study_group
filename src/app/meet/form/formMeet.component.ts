import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/service/auth.service';
import { MeetService } from '../service/meet.service';
import { CreateMeet, UpdateMeet } from '../interface/createMeet.interface';
import { Meet } from '../interface/meet.interface';

@Component({
  selector: 'app-meet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './formMeet.component.html',
  styleUrl: './formMeet.component.scss'
})
export class MeetFormComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly meetService = inject(MeetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  meetId: number | null = null;
  groupId: number | null = null;
  userId: number | null = null;
  meetForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const groupIdParam = params.get('groupId');
      const meetIdParam = params.get('meetId');

      this.groupId = groupIdParam ? Number(groupIdParam) : null;
      this.userId = this.authService.currentUser()?.id ?? null;

      if (meetIdParam) {
        this.isEditMode.set(true);
        this.meetId = Number(meetIdParam);
        this.loadMeetData(this.meetId);
      } else {
        this.isEditMode.set(false);
        this.meetId = null;
        this.meetForm.reset({ description: '', location: '', date_time: null });
      }
    });
  }

  private initForm(): void {
    this.meetForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      date_time: [null, [Validators.required]]
    });
  }

  private loadMeetData(id: number): void {
    this.meetService.findMeet(id).subscribe({
      next: (meet: Meet) => {
        this.meetForm.patchValue({
          title: meet.title,
          description: meet.description,
          location: meet.location,
          date_time: this.formatDateTimeForInput(meet.date_time)
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do encontro.' });
        this.router.navigateByUrl('');
      }
    });
  }

  private formatDateTimeForInput(value: Date | string | null | undefined): string | null {
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
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private formatDateTimeForApi(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.meetForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.meetForm.invalid) {
      this.meetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.meetForm.value;
    const dateTime = this.formatDateTimeForApi(formValue.date_time);

    if (!dateTime) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Informe uma data e hora válidas.' });
      this.isSubmitting.set(false);
      return;
    }

    if (this.isEditMode() && this.meetId) {
      const payload: UpdateMeet = {
        title: formValue.title,
        description: formValue.description,
        location: formValue.location,
        date_time: dateTime,
        group_id: this.groupId ?? 0
      };

      this.meetService.update(this.meetId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Encontro atualizado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    } else {
      const payload: CreateMeet = {
        title: formValue.title,
        description: formValue.description,
        location: formValue.location,
        date_time: dateTime,
        group_id: this.groupId ?? 0,
        user_id: this.userId ?? 0
      };

      this.meetService.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Encontro criado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    }
  }

  private handleSubmittingError(error: HttpErrorResponse): void {
    this.isSubmitting.set(false);
    if (error.status === 409) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Já existe um encontro com esses dados.' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro interno', detail: 'Tente novamente mais tarde', life: 5000 });
    }
  }
}
