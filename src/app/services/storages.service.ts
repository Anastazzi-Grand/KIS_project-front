import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specification } from './specifications.service';

export interface Storage {
  idStorage: number;
  date: Date | string;
  quantity: number;
  typeOfOperation: string;
  specificationId: Specification; 
}

export interface SendStorage {
  idStorage: number;
  date: string;
  quantity: number;
  typeOfOperation: string;
  specificationId: number;
}

const baseUrl = 'http://localhost:8080/api/storages';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  getStorages() {
    return this.http.get<Storage[]>(baseUrl);
  }

  getStorageById(id: number): Observable<Storage> {
    return this.http.get<Storage>(`${baseUrl}/${id}`);
  }

  getCountByIdSpecification(id: number) {
    return this.http.get<Storage>(`${baseUrl}/getCount/${id}`)
  }

  createStorage(storage: SendStorage): Observable<Storage> {
    return this.http.post<Storage>(baseUrl, storage);
  }

  updateStorage(storage: SendStorage): Observable<Storage> {
    return this.http.put<Storage>(`${baseUrl}/${storage.idStorage}`, storage);
  }

  deleteStorage(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
