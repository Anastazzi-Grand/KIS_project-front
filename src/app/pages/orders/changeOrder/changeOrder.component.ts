import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderService, SendOrder } from '../../../services/orders.service';

@Component({
  selector: 'app-change-order',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './changeOrder.component.html',
  styleUrl: './changeOrder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeOrderComponent {
  parentSpecification!: number;
  form!: FormGroup;
  isNewOrder = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendOrder,
    private orderService: OrderService, 
    private formBuilder: FormBuilder
  ) { 
    this.isNewOrder = !this.data;
    const formdata = this.isNewOrder ? {
      id: null,
      clientName: null,
      orderDate: null,
      count: null,
      measureUnit: null,
      specificationId: null
    } : data;
    console.log(formdata)
    this.form = this.formBuilder.group(formdata);
  }

  submitOrder(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value as SendOrder;

    const order: SendOrder = {
      id: value.id,
      clientName: value.clientName,
      orderDate: value.orderDate,
      count: value.count,
      measureUnit: value.measureUnit,
      specificationId: value.specificationId
    }

    this.orderService[this.orderService ? "createOrder" : "updateOrder"](order).subscribe(
      {next: (result) => {
        console.log('Order created:', result);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating order:', error);
      }}
    );

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 }
