import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <-- Import necessário para navegação
import { group_card } from './interface/group_card.interface';
import { area_card } from './interface/area_card.interface';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  
  // Injetando o Router no construtor
  constructor(private router: Router) {}

  // Função que redireciona o usuário para a página da área
  goToArea(areaName: string) {
    const areaFormatada = areaName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
    this.router.navigate(['/area', areaFormatada]);
  }
  
  categories = signal<area_card[]>([
    { name: 'Exatas', icon: 'pi-calculator' },
    { name: 'Humanas', icon: 'pi-book' },
    { name: 'Biológicas', icon: 'pi-eye' },
    { name: 'Tecnologia', icon: 'pi-desktop' },
    { name: 'Idiomas', icon: 'pi-globe' },
    { name: 'Negócios', icon: 'pi-chart-bar' },
    { name: 'Artes', icon: 'pi-palette' },
    { name: 'Saúde', icon: 'pi-heart' }
  ]);

  popularGroups = signal<group_card[]>([
    {
      title: 'Banco de Dados: SQL Avançado',
      institution: 'UnB',
      area: 'Tecnologia',
      members: 12,
      nextMeeting: 'Amanhã, 14:00'
    },
    {
      title: 'Grupo de Leitura: IA Generativa',
      institution: 'USP',
      area: 'Computação',
      members: 8,
      nextMeeting: 'Sexta, 19:00'
    }
  ]);
}
