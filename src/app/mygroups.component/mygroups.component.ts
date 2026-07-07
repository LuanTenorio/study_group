import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { group_card } from '../feed/interface/group_card.interface';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mygroups.component.html',
  styleUrl: './mygroups.component.scss'
})
export class MyGroupsComponent implements OnInit {
  
  myGroups = signal<group_card[]>([]);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService); 

  ngOnInit() {
    this.loadMyGroups();
  }

  loadMyGroups() {
    const currentUser = this.authService.currentUser(); 

    if (!currentUser) {
      this.myGroups.set([]);
      return; 
    }
    const apiUrl = `http://localhost:3000/group/my-groups/${currentUser.id}`;
    
    this.http.get<group_card[]>(apiUrl).subscribe({
      next: (dados) => {
        this.myGroups.set(dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar os meus grupos:', erro);
        this.myGroups.set([]);
      }
    });
  }
}