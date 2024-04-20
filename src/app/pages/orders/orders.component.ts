import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrderService } from '../../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
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
