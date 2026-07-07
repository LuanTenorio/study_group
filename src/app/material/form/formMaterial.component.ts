import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/service/auth.service';
import { MaterialService } from '../service/material.service';
import { Material } from '../interface/material.interface';
import { CreateMaterial, UpdateMaterial } from '../interface/createMaterial.interface';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './formMaterial.component.html',
  styleUrl: './formMaterial.component.scss'
})
export class MaterialFormComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly materialService = inject(MaterialService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  currentFileName = signal<string | null>(null);

  materialId: number | null = null;
  groupId: number | null = null;
  userId: number | null = null;
  materialForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const groupIdParam = params.get('groupId');
      const materialIdParam = params.get('materialId');

      this.groupId = groupIdParam ? Number(groupIdParam) : null;
      this.userId = this.authService.currentUser()?.id ?? null;
      this.selectedFile.set(null);
      this.currentFileName.set(null);

      if (materialIdParam) {
        this.isEditMode.set(true);
        this.materialId = Number(materialIdParam);
        this.loadMaterialData(this.materialId);
      } else {
        this.isEditMode.set(false);
        this.materialId = null;
        this.materialForm.reset({ description: '' });
      }
    });
  }

  private initForm(): void {
    this.materialForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  private loadMaterialData(id: number): void {
    this.materialService.findMaterial(id).subscribe({
      next: (material: Material) => {
        this.materialForm.patchValue({
          description: material.description
        });
        this.currentFileName.set(material.file_type);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do material.' });
        this.router.navigateByUrl('');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.materialForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFileInvalid(): boolean {
    return !this.isEditMode() && !this.selectedFile();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.setSelectedFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.setSelectedFile(file);
  }

  removeSelectedFile(): void {
    this.selectedFile.set(null);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  onSubmit(): void {
    if (this.materialForm.invalid || this.isFileInvalid()) {
      this.materialForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const description = String(this.materialForm.value.description ?? '').trim();

    if (this.isEditMode() && this.materialId) {
      const payload: UpdateMaterial = {
        description,
        group_id: this.groupId ?? 0
      };

      this.materialService.update(this.materialId, payload, this.selectedFile() ?? undefined).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Material atualizado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    } else {
      const file = this.selectedFile();
      if (!file) {
        this.isSubmitting.set(false);
        return;
      }

      const payload: CreateMaterial = {
        description,
        group_id: this.groupId ?? 0,
        user_id: this.userId ?? 0
      };

      this.materialService.create(payload, file).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Material criado com sucesso!' });
          this.router.navigateByUrl(`/group/${this.groupId}`);
        },
        error: (error: HttpErrorResponse) => this.handleSubmittingError(error)
      });
    }
  }

  private setSelectedFile(file: File | null): void {
    if (!file) {
      return;
    }

    this.selectedFile.set(file);
  }

  private handleSubmittingError(error: HttpErrorResponse): void {
    this.isSubmitting.set(false);
    if (error.status === 409) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Já existe um material com esses dados.' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro interno', detail: 'Tente novamente mais tarde', life: 5000 });
    }
  }
}
