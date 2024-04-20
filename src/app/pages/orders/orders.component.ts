import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderService } from '../../services/orders.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatCardModule
  ],
  templateUrl: `./orders.component.html`,
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent { 
  dataOrders$ = this.ordersService.getOrders();

  constructor(private ordersService: OrderService) {
    this.dataOrders$.subscribe();
  }
}
