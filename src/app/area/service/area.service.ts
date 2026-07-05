import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { area_card } from '../interface/area_card.interface';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/area'; // ajuste conforme sua rota no NestJS

  // busca todas as áreas cadastradas no banco
  getAllAreas(): Observable<area_card[]> {
    return this.http.get<area_card[]>(this.apiUrl);
  }

  // busca uma área específica pelo ID
  getAreaById(id: number): Observable<area_card> {
    return this.http.get<area_card>(`${this.apiUrl}/${id}`);
  }
}