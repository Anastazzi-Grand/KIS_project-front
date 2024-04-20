import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Specification {
  positionid: number;
  parent: Specification | null;
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

const baseUrl = 'http://localhost:8080/api/specifications';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  constructor(private http: HttpClient) { }

  getSpecifications(): Observable<Specification[]> {
    return this.http.get<Specification[]>(baseUrl)
  }

  getSpecificationById(id: number): Observable<Specification> {
    return this.http.get<Specification>(`${baseUrl}/${id}`);
  }

  createSpecification(specification: Specification): Observable<Specification> {
    return this.http.post<Specification>(baseUrl, specification);
  }

  updateSpecification(id: number, specification: Specification): Observable<Specification> {
    return this.http.put<Specification>(`${baseUrl}/${id}`, specification);
  }

  deleteSpecification(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
