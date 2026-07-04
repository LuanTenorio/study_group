import { Injectable, signal, computed } from '@angular/core';
import { group_card } from '../interface/group_card.interface';
import { area_card } from '../../area/interface/area_card.interface';

// Dados mockados — quando integrar com o back, isso sai daqui e
// _groups passa a ser preenchido via loadGroups() (ver comentário no final).
const MOCK_GROUPS: group_card[] = [
  { id: 1, title: 'Grupo de Humanas 1', institution: 'UnB', area: 'Humanas', members: 15, nextMeeting: 'Hoje, 19:00' },
  { id: 2, title: 'Estudos Avançados de Humanas', institution: 'USP', area: 'Humanas', members: 22, nextMeeting: 'Amanhã, 10:00' },
  { id: 3, title: 'Grupo de Biológicas 1', institution: 'UnB', area: 'Biológicas', members: 15, nextMeeting: 'Hoje, 19:00' },
  { id: 4, title: 'Estudos Avançados de Biológicas', institution: 'USP', area: 'Biológicas', members: 22, nextMeeting: 'Amanhã, 10:00' },
  { id: 5, title: 'Cálculo I - Monitoria', institution: 'UnB', area: 'Exatas', members: 30, nextMeeting: 'Sexta, 14:00' },
];

// Fonte única das categorias (nomes com acento preservado).
// Antes vivia duplicado dentro do FeedComponent — agora tanto o FeedComponent
// (grid de categorias) quanto o AreaComponent (recuperar nome a partir da URL)
// usam essa mesma lista, evitando divergência.
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

  readonly categories = signal<area_card[]>(CATEGORIES);

  // Lista completa de grupos (fonte única da verdade da página de feed)
  private readonly _groups = signal<group_card[]>(MOCK_GROUPS);

  // Filtros controlados pela barra de pesquisa
  readonly searchTerm = signal('');
  readonly institution = signal('');

  // Filtro de área (usado pela página de área/categoria; '' = qualquer área, usado no feed geral)
  readonly areaFilter = signal('');

  // Lista já filtrada, pronta para o template consumir com groups()
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
  }

  // Remove acentos e deixa minúsculo, pra gerar/comparar slugs de URL
  // (ex: 'Biológicas' -> 'biologicas'). Único lugar onde essa regra existe,
  // usado tanto para montar a URL (goToArea) quanto pra ler ela de volta.
  slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Recupera o nome "de verdade" (com acento) de uma área a partir do slug
  // vindo da URL. Se não achar na lista de categorias, cai no fallback
  // antigo (só capitaliza a primeira letra).
  getAreaNameBySlug(slug: string): string {
    const found = this.categories().find(c => this.slugify(c.name) === slug.toLowerCase());
    if (found) return found.name;
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  // Futuro: substituir o mock por uma chamada real ao back.
  // constructor(private readonly http: HttpClient) {}
  // loadGroups(areaId?: number) {
  //   this.http.get<group_card[]>(`${environment.apiUrl}/group`, { params: areaId ? { areaId } : {} })
  //     .subscribe(list => this._groups.set(list));
  // }
}