import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GroupService } from './service/group.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Group } from './interface/group.interface';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { Material } from '../material/interface/material.interface';
import { Notice } from '../notice/interface/notice.interface';
import { Meet } from '../meet/interface/meet.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, AccordionModule, RouterModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {

  id: number = 0;
  group: WritableSignal<Group | undefined> = signal<Group | undefined>(undefined);
  requestError = signal(false);
  activeTabs: string[] = ['notices', 'materiais', 'meets'];
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  constructor(
    private readonly groupService: GroupService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.requestError.set(false)
      this.id = Number(params.get("id"))
    
      this.groupService.findGroup(this.id).subscribe({
        next: groupData => {
          this.group.set(groupData);
        },
        error: (err: HttpErrorResponse) => {
          this.requestError.update(v => true)
          if(err.status == 401){
            this.messageService.add({ severity: 'error', summary: 'Não inscrito', detail: 'Você não está inscrito nesse grupo', life: 5000 })
          }else{
            this.messageService.add({ severity: 'error', summary: 'Erro interno', detail: 'Erro ao carregar grupo. Tente novamente mais tarde', life: 5000 })
          }
          this.router.navigateByUrl("") 
        }
      });
    })
  }

  delete() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja deletar este grupo de estudos? Esta ação não pode ser desfeita.',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => this.deleteGroup(),
    });
  }

  private deleteGroup(){
    this.groupService.delete(this.id).subscribe({
      next: () => this.router.navigateByUrl("/"),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar grupo', life: 5000 })
    })
  }

  openNotice(notice: Notice){
    this.router.navigate(['/group', this.id, 'notice', notice.id]);
  }
  
  openMaterial(material: Material){
    this.router.navigate(['/group', this.id, 'material', material.id]);
  }
  
  openMeet(meet: Meet){
    this.router.navigate(['/group', this.id, 'meet', meet.id]);
  }

  getMaterialIcon(material: Material): string{
    switch(material.file_type) {
      case "application/pdf": 
        return "file-pdf";
      
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "file-excel";
        
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "text/plain":
        return "file-word";
        
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return "image";
      
      default: 
        return "file";
    }
  }
}