import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../config/environment.dev';
import { UpdateUserRequest, User } from '../interface/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly path = '/user';
    private readonly apiUrl = `${environment.apiUrl}${this.path}`;

    constructor(private readonly http: HttpClient) {}

    update(id: number, data: UpdateUserRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, data);
    }

    deleteMe(): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/me`);
    }
}
