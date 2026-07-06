import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { GroupService } from '../service/group.service';
import { CreateGroup } from '../interface/create-group.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    InputTextModule, 
    ButtonModule, 
    SelectModule
  ],
  templateUrl: './formGroup.component.html',
  styleUrl: './formGroup.component.scss'
})
export class FormGroupComponent implements OnInit {

  private messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly groupService = inject(GroupService);
  private readonly router = inject(Router);

  isSubmitting = signal(false);
  
  ngOnInit(): void {
    this.groupService.getAreas().subscribe({
      next: areas => this.areas.set(areas.map(({name, id}) => ({label: name, value: id}))),
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Erro ao buscar áreas', detail: 'Tente novamente mais tarde', life: 5000 })
        this.router.navigateByUrl('')
      }
    })
  }

  areas: WritableSignal<{label: string, value: number}[]> = signal([]) 

  groupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    areaId: [null, [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    
    this.isSubmitting.set(true);
    const data: CreateGroup = this.groupForm.value;
    
    this.groupService.create(data).subscribe({
      next: () => {
        this.router.navigateByUrl("")
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false)
        if(error.status == 409){
          this.messageService.add({ severity: 'error', summary: 'Nome do grupo já existe', detail: 'Não pode haver 2 grupos com o mesmo nome', life: 5000 })
        }else{
          this.messageService.add({ severity: 'error', summary: 'Erro interno do servidor', detail: 'Tente novamente mais tarde', life: 5000 })
        }
      }
    })
  }
}