import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { group_card } from '../feed/interface/group_card.interface';

@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mygroups.component.html',
  styleUrl: './mygroups.component.scss'
})
export class MyGroupsComponent implements OnInit {
  
  // Signal para guardar os grupos do utilizador
  myGroups = signal<group_card[]>([]);

  // Injeção do HttpClient para aceder ao backend
  private readonly http = inject(HttpClient);

  // ID do utilizador (mockado para testes até termos o sistema de login pronto)
  private readonly currentUserId = 1;

  ngOnInit() {
    this.loadMyGroups();
  }

  loadMyGroups() {
    // Chamada à nova rota que vamos criar no backend NestJS
    const apiUrl = `http://localhost:3000/group/my-groups/${this.currentUserId}`;
    
    this.http.get<group_card[]>(apiUrl).subscribe({
      next: (dados) => {
        this.myGroups.set(dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar os meus grupos:', erro);
        // Se houver erro ou não encontrar nada, garantimos que a lista fica vazia
        // para exibir o "Empty State" bonitinho que criámos no HTML
        this.myGroups.set([]);
      }
    });
  }
}