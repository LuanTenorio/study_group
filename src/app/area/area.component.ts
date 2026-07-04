import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '../feed/service/feed.service';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent implements OnInit {

  // Injetando o service compartilhado
  readonly feedService = inject(FeedService);
  
  areaName = signal<string>('Carregando...');
  
  // Consumindo a lista de grupos diretamente do service (já filtrada!)
  groups = this.feedService.groups;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Escuta a URL para saber qual área o usuário acessou
    this.route.paramMap.subscribe(params => {
      const slug = params.get('name') || '';
      
      // Usa o service para pegar o nome real (ex: "Biológicas")
      const realName = this.feedService.getAreaNameBySlug(slug);
      this.areaName.set(realName);
      
      // Limpa buscas anteriores e seta o filtro exclusivo para esta área
      this.feedService.clearFilters();
      this.feedService.setArea(realName);
    });
  }
}