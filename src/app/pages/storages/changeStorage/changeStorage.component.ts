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
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SendStorage, StorageService } from '../../../services/storages.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable, forkJoin, map, mergeMap, of, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpecificationsComponent } from '../../specifications/specifications.component';
import { Specification, SpecificationService, TransformSpecification } from '../../../services/specifications.service';

@Component({
  selector: 'app-change-storage',
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
  templateUrl: './changeStorage.component.html',
  styleUrl: './changeStorage.component.css',
  providers: [SpecificationsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeStorageComponent {
  parentSpecification!: number;
  form!: FormGroup;
  isNewStorage = false;
  dataSpecifications: TransformSpecification[] = [];

  dateControl = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<ChangeStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendStorage,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private specificationComponent: SpecificationsComponent,
    private specificationService: SpecificationService
  ) {
    this.isNewStorage = !this.data;
    const formdata = this.isNewStorage ? {
      idStorage: null,
      date: null,
      quantity: null,
      typeOfOperation: "приход",
      specificationId: null
    } : this.data;
    console.log(formdata)
    this.form = this.formBuilder.group(formdata);
    this.dateControl.valueChanges.pipe(startWith(this.dateControl.value), takeUntilDestroyed())
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
    if (!specification) {
      return of([]);
    }
  
    const storageItems: SendStorage[] = [];
    const leafMaterials = this.specificationComponent.getLeafMaterials(specification);
    leafMaterials.forEach((material) => {
      const storageItem: SendStorage = {
        date: this.form.value.date,
        quantity: this.form.value.quantity * material.quantityPerParent,
        typeOfOperation: "Приход",
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
  
  submitStorage(): void {
    if (this.form.invalid) {
      return;
    }
  
    const value = this.form.value as SendStorage;
    const selectedSpec = this.findSpecification(this.dataSpecifications, value.specificationId);
  
    if (selectedSpec) {
      this.processSpecification(selectedSpec).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Ошибка обработки спецификации:', error);
        }
      );
    } else {
      console.error('Выбрана неверная спецификация');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
