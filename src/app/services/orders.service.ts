import { Injectable } from '@angular/core';
import { Specification } from './specifications.service';
import { HttpClient } from '@angular/common/http';

export interface Order {
  id: number;
  clientName: string;
  orderDate: string;
  count: number;
  measureUnit: string;
  specificationId: Specification;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders() {
    return this.http.get<Order[]>("http://localhost:8080/api/orders");
  }

}
