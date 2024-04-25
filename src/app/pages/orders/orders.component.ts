import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Order, OrderService } from '../../services/orders.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, takeUntil } from 'rxjs';
import { DeleteOrderComponent } from './deleteOrder/deleteOrder.component';
import { ChangeOrderComponent } from './changeOrder/changeOrder.component';

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
  refresh$ = new BehaviorSubject(undefined);

  dataOrders$ = this.refresh$.pipe(
    switchMap(() => this.ordersService.getOrders()),
    shareReplay(1)
  );

  destroyRef = inject(DestroyRef);

  constructor(private ordersService: OrderService, public dialog: MatDialog) {
    this.dataOrders$.subscribe();
  }

  openAddOrderDialog(): void {
    const dialogRef = this.dialog.open(ChangeOrderComponent, {
      width: '400px', 
      data: null 
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The add order dialog was closed');
    });
  }

  openChangeOrderDialog(node: Order): void {
    const dialogRef = this.dialog.open(ChangeOrderComponent, {
      width: '400px',
      data: node
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The change order dialog was closed');
    });
  }

  openDeleteOrderDialog(node: Order): void {
    const dialogRef = this.dialog.open(DeleteOrderComponent, {
      width: '400px',
      data: node.id
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The delete order dialog was closed');
    });
  }
}
