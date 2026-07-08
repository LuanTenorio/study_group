import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment.dev';
import { Meet } from '../interface/meet.interface';
import { CreateMeet, UpdateMeet } from '../interface/createMeet.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetService {

  private readonly path = "/meet"
  private readonly apiUrl = `${environment.apiUrl}${this.path}`;

  constructor(private readonly http: HttpClient) {}

  findMeetsByGroupId(id: number){
    return this.http.get<Meet[]>(`${this.apiUrl}/group/${id}`).pipe(map(v => {
      return v.map(meet => ({...meet, date_time: new Date(meet.date_time)}))
    }))
  }

  findMeet(id: number){
    return this.http.get<Meet>(`${this.apiUrl}/${id}`).pipe(map(v => {
      return {...v, date_time: new Date(v.date_time)}
    }))
  }

  create(data: CreateMeet){
    return this.http.post(this.apiUrl, data);
  }

  delete(id: number, groupId: number){
    return this.http.delete(`${this.apiUrl}/${id}/group/${groupId}/meet/delete`)
  }

  update(id: number, data: UpdateMeet){
    return this.http.patch(`${this.apiUrl}/${id}`, data)
  }

}
