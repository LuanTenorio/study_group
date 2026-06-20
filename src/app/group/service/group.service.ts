import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly path = "/group"
  private readonly apiUrl = `${process.env['API_URL']}${this.path}`;

  constructor(private readonly http: HttpClient) {}

}
