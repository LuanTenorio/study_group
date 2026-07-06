import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GroupService } from '../group/service/group.service';
import { Group } from '../group/interface/group.interface';
import { Material } from './interface/material.interface';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  groupId = 0;
  materialId = 0;
  material: WritableSignal<Material | undefined> = signal<Material | undefined>(undefined);
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
      this.materialId = Number(params.get('materialId'));

      if (!this.groupId || !this.materialId) {
        this.requestError.set(true);
        this.isLoading.set(false);
        return;
      }

      this.groupService.findGroup(this.groupId).subscribe({
        next: (groupData: Group) => {
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
}
