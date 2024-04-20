import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Specification {
  positionid: number;
  parent: Specification;
  description: string;
  quantityPerParent: number;
  unitMeasurement: string;
}

export interface TransformSpecification {
  positionid: number;
  children: TransformSpecification[];
  description: string;
  quantityPerParent: number;
  unitMeasurement: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getSpecifications() {
    return this.http.get<Specification[]>("http://localhost:8080/api/specifications")
  }
}
