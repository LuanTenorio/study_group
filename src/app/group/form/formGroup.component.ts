import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';

import { GroupService } from '../service/group.service';
import { CreateGroup } from '../interface/create-group.interface';
import { Area } from '../../area/interface/area.interface';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    InputTextModule, 
    ButtonModule, 
    MultiSelectModule
  ],
  templateUrl: './formGroup.component.html',
  styleUrl: './formGroup.component.scss'
})
export class FormGroupComponent implements OnInit {

  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = signal(false);
  groupId: number | null = null;
  isSubmitting = signal(false);
  areas: WritableSignal<Area[]> = signal([]); 
  
  groupForm!: FormGroup;
  
  ngOnInit(): void {
    this.initForm();
    this.getAreas();
    
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.isEditMode.set(true);
        this.groupId = Number(idParam);
        this.loadGroupData(this.groupId);
      } else {
        this.isEditMode.set(false);
        this.groupId = null;
        this.groupForm.reset({ name: '', areas: [] });
      }
    });
  }

  private initForm(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      areas: [[], [Validators.required]]
    });
  }

  private loadGroupData(id: number): void {
    this.groupService.findGroup(id).subscribe({
      next: (group) => {
        this.groupForm.patchValue({
          name: group.name,
          areas: group.areas || []
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados para edição.' });
        this.router.navigateByUrl("");
      }
    });
  }

  getAreas(): void {
    this.groupService.getAreas().subscribe({
      next: areas => this.areas.set(areas),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro ao buscar áreas', detail: 'Tente novamente mais tarde', life: 5000 });
        this.router.navigateByUrl('');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    const formValue = this.groupForm.value;
    const payload: CreateGroup = {
      name: formValue.name,
      areas: (formValue.areas as Area[] || []).map(({ id }) => id)
    };
    
    if (this.isEditMode() && this.groupId) {
      this.groupService.update(this.groupId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Grupo atualizado com sucesso!' });
          this.router.navigateByUrl("");
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    } else {
      this.groupService.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Grupo criado com sucesso!' });
          this.router.navigateByUrl("");
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    }
  }

  private handleSubmittingError(error: HttpErrorResponse): void {
    this.isSubmitting.set(false);
    if (error.status === 409) {
      this.messageService.add({ severity: 'error', summary: 'Nome já existe', detail: 'Não pode haver 2 grupos com o mesmo nome', life: 5000 });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro interno', detail: 'Tente novamente mais tarde', life: 5000 });
    }
  }
}