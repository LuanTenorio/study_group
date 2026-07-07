import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { group_card } from '../interface/group_card.interface';
import { area_card } from '../../area/interface/area_card.interface';
import { AreaService } from '../../area/service/area.service';


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  // injetando o HttpClient para poder acessar o backend
  private readonly http = inject(HttpClient);
  private readonly areaService = inject(AreaService);

  readonly categories = signal<area_card[]>([]);

  // declarando a lista de grupos como um signal privado, que será atualizado quando os dados forem carregados do backend
  private readonly _groups = signal<group_card[]>([]);

  // filtros de busca e seleção
  readonly searchTerm = signal('');
  readonly institution = signal('');
  readonly areaFilter = signal('');

  

  // lista de grupos que será consumida pelos componentes
 readonly groups = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const inst = this.institution().trim().toLowerCase();
    const area = this.areaFilter().toLowerCase();

    return this._groups().filter(group => {
      const matchesTerm = !term || group.title.toLowerCase().includes(term);
      const matchesInstitution = !inst || group.institution.toLowerCase().includes(inst);
      const matchesArea = !area || group.area.toLowerCase().includes(area);
      return matchesTerm && matchesInstitution && matchesArea;
    })
    // orderna os grupos filtrados por número de membros, do maior para o menor
    .sort((a, b) => b.members - a.members); 
  });

  constructor() {
    this.loadGroups();
    this.loadAreas(); 
  }

  // --- MÉTODO DE BUSCA DE AREAS---
  loadAreas(): void {
    this.areaService.getAllAreas().subscribe({
      next: (areasDoBackend) => {
        this.categories.set(areasDoBackend);
      },
      error: (erro) => {
        console.error('Falha ao buscar as áreas de conhecimento:', erro);
      }
    });
  }

  // --- MÉTODO DE BUSCA GRUPOS---

  loadGroups(): void {
    // acessa o endpoint do backend para buscar todos os grupos
    const apiUrl = 'http://localhost:3000/group/all';

    this.http.get<group_card[]>(apiUrl).subscribe({
      next: (dadosDoBackend) => {

        this._groups.set(dadosDoBackend);
      },
      error: (erro) => {
        console.error('Falha ao buscar grupos do backend:', erro);
      }
    });
  }

  // --- MÉTODOS DE FILTRO E AUXILIARES ---

 
  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setInstitution(institution: string): void {
    this.institution.set(institution);
  }

  setArea(area: string): void {
    this.areaFilter.set(area);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.institution.set('');
    this.areaFilter.set('');
  }

  slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getAreaNameBySlug(slug: string): string {
    const found = this.categories().find(c => this.slugify(c.name) === slug.toLowerCase());
    if (found) return found.name;
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
}