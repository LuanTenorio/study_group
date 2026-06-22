import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { GroupService } from './service/group.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Group } from './interface/group.interface';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { Material } from '../material/interface/material.interface';
import { Notice } from '../notice/interface/notice.interface';
import { Meet } from '../meet/interface/meet.interface';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, AccordionModule, RouterModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {

  id: number = 0;
  group: WritableSignal<Group | undefined> = signal<Group | undefined>(undefined);
  requestError = signal(false);

  activeTabs: string[] = ['notices', 'materiais', 'meets'];

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
        error: err => {
          console.error('Erro ao buscar o grupo:', err)
          this.requestError.update(v => true)
          // this.router.navigate(["/"]) TODO: Voltar pra página inicial e lançar aviso
        }
      });
    })
  }

  openNotice(notice: Notice){
  }
  
  openMaterial(material: Material){
    
  }
  
  openMeet(meet: Meet){
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