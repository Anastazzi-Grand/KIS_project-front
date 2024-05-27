import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderService, SendOrder } from '../../../services/orders.service';
import { Specification, SpecificationService, TransformSpecification } from '../../../services/specifications.service';
import { FlatNode, SpecificationsComponent } from '../../specifications/specifications.component';
import { SendStorage, StorageService } from '../../../services/storages.service';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Storage } from '../../../services/storages.service';

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
    ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule,
    MatSelectModule,

  ],
  templateUrl: './changeOrder.component.html',
  styleUrl: './changeOrder.component.css',
  providers: [SpecificationsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeOrderComponent implements OnInit {
  form!: FormGroup;
  isNewOrder = false;
  dataSpecifications: TransformSpecification[] = [];

  constructor(
    public dialogRef: MatDialogRef<ChangeOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendOrder,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private specificationService: SpecificationService,
    private specificationComponent: SpecificationsComponent,
    private storageService: StorageService
  ) {
    this.isNewOrder = !data?.id;
    const formdata = this.isNewOrder ? {
      id: null,
      clientName: null,
      orderDate: null,
      count: null,
      measureUnit: null,
      specificationId: null
    } : this.data;
    console.log(formdata);
    this.form = this.formBuilder.group(formdata);
  }

  ngOnInit() {
    this.specificationService.getSpecifications()
      .subscribe((specs: Specification[]) => {
        this.dataSpecifications = this.specificationComponent.buildTree(specs);
      });
  }

  private findSpecification(
    specifications: TransformSpecification[],
    specificationId: number
  ): TransformSpecification | null {
    const queue: TransformSpecification[] = [...specifications];
    while (queue.length > 0) {
      const spec = queue.shift();
      if (spec && spec.positionid === specificationId) {
        return spec;
      }
      if (spec && spec.children && spec.children.length > 0) {
        queue.push(...spec.children);
      }
    }
    return null;
  }
  
  private processSpecification(specification: TransformSpecification | null): Observable<any> {
    console.log('processSpecification() вызван');
    if (!specification) {
      return of([]);
    }
  
    const storageItems: SendStorage[] = [];
    const leafMaterials = this.specificationComponent.getLeafMaterials(specification);
    leafMaterials.forEach((material) => {
      const storageItem: SendStorage = {
        date: this.form.value.orderDate,
        quantity: this.form.value.count * material.quantityPerParent,
        typeOfOperation: "Уход",
        specificationId: material.positionid
      };
      storageItems.push(storageItem);
    });
  
    return forkJoin(
      storageItems.map((item) => this.storageService.createStorage(item))
    ).pipe(
      map(() => storageItems)
    );
  }

  submitOrder(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value as SendOrder;
    let order: SendOrder = {
      id: value.id,
      clientName: value.clientName,
      orderDate: value.orderDate,
      count: value.count,
      measureUnit: value.measureUnit,
      specificationId: value.specificationId
    };

    const selectedSpec = this.findSpecification(this.dataSpecifications, order.specificationId);

    if (selectedSpec) {
      this.processSpecification(selectedSpec).subscribe(
        () => {
          this.orderService[this.isNewOrder ? "createOrder" : "updateOrder"](order)
            .subscribe(
              (result) => {
                console.log('Order created:', result);
                this.dialogRef.close(true);
              },
              (error) => {
                console.error('Error creating order:', error);
              }
            );
        },
        (error) => {
          console.error('Error processing specification:', error);
        }
      );
    } else {
      console.error('No selected specification');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}