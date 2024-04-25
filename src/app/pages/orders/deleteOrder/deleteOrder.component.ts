import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../../../services/orders.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-order',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './deleteOrder.component.html',
  styleUrl: './deleteOrder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteOrderComponent { 
  constructor(
    public dialogRef: MatDialogRef<DeleteOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private orderService: OrderService
  ) { }

  submitOrder(): void {
    this.orderService.deleteOrder(this.data)
      .subscribe(
        () => {
          console.log('Storage deleted successfully.');
          this.dialogRef.close(true);
        }
      );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
