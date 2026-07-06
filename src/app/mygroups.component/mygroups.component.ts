import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Ajuste o caminho de importação consoante a localização real da sua interface no projeto
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

  ngOnInit() {
    // 💡 TODO: Futuramente, fará a requisição HTTP aqui (ex: this.http.get('/groups/me'))
    
    // Dados mockados para poder testar o visual. 
    // Para testar a mensagem de "Nenhum grupo", basta deixar o array vazio: this.myGroups.set([]);
    this.myGroups.set([
      {
         id: 1,
         title: 'Estudos de SQL Avançado',
         institution: 'UnB',
         area: 'Banco de Dados',
         members: 2,
         nextMeeting: '15/07, 14:00'
      }
    ]);
  }
}