import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '../feed/service/feed.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-area',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent implements OnInit {

  // injetando o service para poder acessar a lista de grupos e categorias e as funções de filtro
  readonly feedService = inject(FeedService);
  
  areaName = signal<string>('Carregando...');
  
  // consumindo a lista de grupos diretamente do service (já filtrada)
  groups = this.feedService.groups;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // puxa a area pela url da pagina
    this.route.paramMap.subscribe(params => {
      const slug = params.get('name') || '';
      
      // usa o service para pegar converter para o nome real da area
      const realName = this.feedService.getAreaNameBySlug(slug);
      this.areaName.set(realName);
      
      // limpa as buscas e aplica o filtro de area para que os grupos mostrados sejam apenas os da area selecionada
      this.feedService.clearFilters();
      this.feedService.setArea(realName);
    });
  }
}