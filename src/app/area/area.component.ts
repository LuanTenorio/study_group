import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { group_card } from '../feed/interface/group_card.interface';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss' // Vamos usar o mesmo estilo!
})
export class AreaComponent implements OnInit {
  areaName = signal<string>('Carregando...');
  groups = signal<group_card[]>([]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Escuta as mudanças na URL para pegar o nome da área
    this.route.paramMap.subscribe(params => {
      const paramName = params.get('name');
      
      if (paramName) {
        // Formata a string (ex: 'tecnologia' vira 'Tecnologia')
        const formattedName = paramName.charAt(0).toUpperCase() + paramName.slice(1);
        this.areaName.set(formattedName);
        
        // Mock dos grupos baseados na área selecionada
        this.groups.set([
          {
            title: `Grupo de ${formattedName} 1`,
            institution: 'UnB',
            area: formattedName,
            members: 15,
            nextMeeting: 'Hoje, 19:00'
          },
          {
            title: `Estudos Avançados de ${formattedName}`,
            institution: 'USP',
            area: formattedName,
            members: 22,
            nextMeeting: 'Amanhã, 10:00'
          }
        ]);
      }
    });
  }
}
