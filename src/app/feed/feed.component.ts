import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  
  // Categorias de Áreas de Conhecimento
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
    },
    {
      title: 'Engenharia de Software Ágil',
      institution: 'UFMG',
      area: 'Tecnologia',
      members: 7,
      nextMeeting: 'Segunda, 10:00'
    },
    {
      title: 'Cálculo 2 - Resolução de Listas',
      institution: 'Unicamp',
      area: 'Exatas',
      members: 25,
      nextMeeting: 'Hoje, 16:00'
    }
  ]);
}