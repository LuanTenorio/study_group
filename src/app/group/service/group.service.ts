import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment.dev';
import { Group } from '../interface/group.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly path = "/group"
  private readonly apiUrl = `${environment.apiUrl}${this.path}`;

  constructor(private readonly http: HttpClient) {}

  findGroup(id: number){
    return this.http.get<Group>(`${this.apiUrl}/${id}`).pipe(map(v => {
      v.comments = v.comments.map(comment => ({...comment, created_at: new Date(comment.created_at)}))
      v.notices = v.notices.map(notice => ({...notice, created_at: new Date(notice.created_at), expiration_date: new Date(notice.expiration_date)}))
      v.meets = v.meets.map(meet => ({...meet, date_time: new Date(meet.date_time)}))
      v.materials = v.materials.map(material => ({...material, uploaded_at: new Date(material.uploaded_at)}))
      v.creation_date = new Date(v.creation_date)

      return v
    }))
  }

}
