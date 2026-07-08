import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment.dev';
import { Notice } from '../interface/notice.interface';
import { CreateNotice, UpdateNotice } from '../interface/createNotice.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private readonly path = "/notice"
  private readonly apiUrl = `${environment.apiUrl}${this.path}`;

  constructor(private readonly http: HttpClient) {}

  findNoticesByGroupId(id: number){
    return this.http.get<Notice[]>(`${this.apiUrl}/group/${id}`).pipe(map(v => {
      return v.map(notice => ({...notice, created_at: new Date(notice.created_at), expiration_date: new Date(notice.expiration_date)}))
    }))
  }

  findNotice(id: number){
    return this.http.get<Notice>(`${this.apiUrl}/${id}`).pipe(map(v => {
      return {...v, created_at: new Date(v.created_at), expiration_date: new Date(v.expiration_date)}
    }))
  }

  create(data: CreateNotice){
    return this.http.post(this.apiUrl, data);
  }

  delete(id: number, groupId: number){
    return this.http.delete(`${this.apiUrl}/${id}/group/${groupId}/notice/delete`)
  }

  update(id: number, data: UpdateNotice){
    return this.http.patch(`${this.apiUrl}/${id}`, data)
  }

}
