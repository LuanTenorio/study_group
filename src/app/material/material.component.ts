import { Component, OnInit, signal, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Group } from '../group/interface/group.interface';
import { MaterialService } from './service/material.service';
import { Material } from './interface/material.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  groupId = 0;
  materialId = 0;
  material: WritableSignal<Material | undefined> = signal<Material | undefined>(undefined);
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
    private readonly materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading.set(true);
      this.requestError.set(false);

      this.groupId = Number(params.get('groupId'));
      this.materialId = Number(params.get('materialId'));

      if (!this.groupId || !this.materialId) {
        this.requestError.set(true);
        this.isLoading.set(false);
        return;
      }

      this.groupService.findGroup(this.groupId).subscribe({
        next: (groupData: Group) => {
          this.group.set(groupData);
          this.groupName.set(groupData.name);
          const found = groupData.materials.find(item => item.id === this.materialId);
          if (found) {
            this.material.set(found);
          } else {
            this.requestError.set(true);
          }
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Erro ao carregar material:', err);
          this.requestError.set(true);
          this.isLoading.set(false);
        }
      });
    });
  }

  downloadMaterialPdf() {
    this.materialService.download(this.material()?.id!).subscribe(blob => {
        const url = URL.createObjectURL(blob);
        window.open(url);
    });
  }

  goBack(): void {
    this.router.navigate(['/group', this.groupId]);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  editMaterial() {
    this.router.navigate(['/group', this.groupId, 'material', 'edit', this.materialId]);
  }

  deleteMaterial() {
      this.confirmationService.confirm({
        message: 'Você tem certeza que deseja deletar este material? Esta ação não pode ser desfeita.',
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
      const materialId = this.material()?.id ?? this.materialId;
  
      this.materialService.delete(materialId, this.groupId).subscribe({
        next: () => this.router.navigateByUrl("/group/" + this.groupId),
        error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar material', life: 5000 })
      })
    }
}
