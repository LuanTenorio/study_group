import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../config/environment.dev';
import { Institution } from '../interface/institution.interface';

@Injectable({
    providedIn: 'root'
})
export class InstitutionService {
    private readonly path = '/institutions';
    private readonly apiUrl = `${environment.apiUrl}${this.path}`;

    constructor(private readonly http: HttpClient) {}

    findAll(): Observable<Institution[]> {
        return this.http.get<Institution[]>(this.apiUrl);
    }
}
