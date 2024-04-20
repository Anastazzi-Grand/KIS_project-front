import { Injectable } from '@angular/core';
import { Specification } from './specifications.service';
import { HttpClient } from '@angular/common/http';

export interface Storage {
  idStorage: number;
  dateAndTime: string;
  quantity: number;
  typeOfOperation: string;
  specificationId: Specification; 
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  getStorages() {
    return this.http.get<Storage[]>("http://localhost:8080/api/storages");
  }
}
