import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../config/environment.dev';
import { Material } from '../interface/material.interface';
import { CreateMaterial, UpdateMaterial } from '../interface/createMaterial.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private readonly path = "/material"
  private readonly apiUrl = `${environment.apiUrl}${this.path}`;

  constructor(private readonly http: HttpClient) {}

  findMaterialsByGroupId(id:number){
    return this.http.get<Material[]>(`${this.apiUrl}/group/${id}`).pipe(map(materials => {
      return materials.map(material => ({...material, uploaded_at: new Date(material.uploaded_at)}));
    }));
  }

  findMaterial(id: number){
     return this.http.get<Material>(`${this.apiUrl}/${id}`).pipe(map(material => {
      return {...material, uploaded_at: new Date(material.uploaded_at)};
     }));
  }

  create(material: CreateMaterial, file: File){
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", material.title);
    formData.append("description", material.description);
    formData.append("user_id", material.user_id.toString());
    formData.append("group_id", material.group_id.toString());
    return this.http.post(this.apiUrl, formData);
  }

  delete(id: number, groupId: number){
    return this.http.delete(`${this.apiUrl}/${id}/group/${groupId}/material/delete`)
  }

  update(id: number, material: UpdateMaterial, file?: File){
    const formData = new FormData();
    formData.append("title", material.title);
    formData.append("description", material.description);
    formData.append("group_id", material.group_id.toString());
    if(file){
        formData.append("file", file);
    }
    return this.http.patch(`${this.apiUrl}/${id}`, formData);
  }

  download(id: number){
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: "blob" });
  }

}
