import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { group_card } from '../interface/group_card.interface';
import { area_card } from '../../area/interface/area_card.interface';

// Fonte única das categorias (mantemos o mock estático para o menu)
const CATEGORIES: area_card[] = [
  { id: 1, name: 'Exatas', icon: 'pi-calculator' },
  { id: 2, name: 'Humanas', icon: 'pi-book' },
  { id: 3, name: 'Biológicas', icon: 'pi-eye' },
  { id: 4, name: 'Tecnologia', icon: 'pi-desktop' },
  { id: 5, name: 'Idiomas', icon: 'pi-globe' },
  { id: 6, name: 'Negócios', icon: 'pi-chart-bar' },
  { id: 7, name: 'Artes', icon: 'pi-palette' },
  { id: 8, name: 'Saúde', icon: 'pi-heart' }
];

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  // injetando o HttpClient para poder acessar o backend
  private readonly http = inject(HttpClient);

  readonly categories = signal<area_card[]>(CATEGORIES);

  // declarando a lista de grupos como um signal privado, que será atualizado quando os dados forem carregados do backend
  private readonly _groups = signal<group_card[]>([]);

  // filtros de busca e seleção
  readonly searchTerm = signal('');
  readonly institution = signal('');
  readonly areaFilter = signal('');

  // lista de grupos que será consumida pelos componentes
  readonly groups = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const inst = this.institution();
    const area = this.areaFilter().toLowerCase();

    return this._groups().filter(group => {
      const matchesTerm = !term || group.title.toLowerCase().includes(term);
      const matchesInstitution = !inst || group.institution.toLowerCase() === inst.toLowerCase();
      const matchesArea = !area || group.area.toLowerCase() === area;
      return matchesTerm && matchesInstitution && matchesArea;
    });
  });

  constructor() {
    // assim que o service é instanciado, ele carrega os grupos do backend
    this.loadGroups();
  }

  // --- MÉTODO DE BUSCA ---

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