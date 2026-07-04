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

  readonly feedService = inject(FeedService);

  // categorias puxadas do service
  categories = this.feedService.categories;

  // lista de grupos populares (sem filtros) puxada do service
  popularGroups = this.feedService.groups;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // retira os filtros de busca e área ao entrar na página principal
    this.feedService.clearFilters();
    this.feedService.setArea('');
  }

  // função que redireciona o usuário para a página da área
  goToArea(areaName: string) {
    const areaFormatada = this.feedService.slugify(areaName);
    this.router.navigate(['/area', areaFormatada]);
  }

}