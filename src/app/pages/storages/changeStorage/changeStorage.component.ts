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
import { startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeStorageComponent {
  parentSpecification!: number;
  form!: FormGroup;
  isNewStorage = false;

  dateControl = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<ChangeStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendStorage,
    private storageService: StorageService, 
    private formBuilder: FormBuilder
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

  submitStorage(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value as SendStorage;

    const storage: SendStorage = {
      idStorage: value.idStorage,
      date: value.date,
      quantity: value.quantity,
      typeOfOperation: value.typeOfOperation,
      specificationId: value.specificationId,
    }

    this.storageService[this.isNewStorage ? "createStorage" : "updateStorage"](storage).subscribe(
      {next: (result) => {
        console.log('Storage created:', result);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating storage:', error);
      }}
    );

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 }
