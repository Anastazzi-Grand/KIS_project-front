import { Injectable } from '@angular/core';
import { Specification } from './specifications.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  clientName: string;
  orderDate: string;
  count: number;
  measureUnit: string;
  specificationId: Specification;
}

export interface SendOrder {
  id: number;
  clientName: string;
  orderDate: string;
  count: number;
  measureUnit: string;
  specificationId: number;
}

const baseUrl = 'http://localhost:8080/api/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders() {
    return this.http.get<Order[]>("http://localhost:8080/api/orders");
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${baseUrl}/${id}`);
  }

  createOrder(order: SendOrder): Observable<Order> {
    return this.http.post<Order>(baseUrl, order);
  }

  updateOrder(order: SendOrder): Observable<Order> {
    return this.http.put<Order>(`${baseUrl}/${order.id}`, order);
  }

  deleteOrder(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }

}
