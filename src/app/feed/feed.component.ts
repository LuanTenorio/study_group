import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeedService } from './service/feed.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {

  // Público para o template poder chamar feedService.setSearchTerm(...) etc.
  readonly feedService = inject(FeedService);

  // Categorias agora vêm do service (fonte única, compartilhada com AreaComponent)
  categories = this.feedService.categories;

  // Grupos "populares" da home = lista do service (busca + instituição),
  // sem filtro de área, já que aqui mostramos grupos de todas as áreas.
  popularGroups = this.feedService.groups;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Garante que, ao voltar do /area/xxx para a home, nenhum filtro
    // de área/busca antigo continue aplicado (o service é singleton).
    this.feedService.clearFilters();
    this.feedService.setArea('');
  }

  // Função que redireciona o usuário para a página da área
  goToArea(areaName: string) {
    const areaFormatada = this.feedService.slugify(areaName);
    this.router.navigate(['/area', areaFormatada]);
  }

}