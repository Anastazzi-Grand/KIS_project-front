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
import { SendSpecification, Specification, SpecificationService, TransformSpecification } from '../../../services/specifications.service';
import { FlatNode } from '../specifications.component';

@Component({
  selector: 'app-change-dialog-data',
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
    ReactiveFormsModule
  ],
  templateUrl: './changeDialogData.component.html',
  styleUrl: './changeDialogData.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDialogDataComponent {
  parentSpecification!: number;
  form!: FormGroup;
  isNewSpecification = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FlatNode,
    private specificationService: SpecificationService, 
    private formBuilder: FormBuilder
  ) { 
    this.isNewSpecification = !this.data;
    const formdata = this.isNewSpecification ? {
      positionid: null,
      description: null,
      quantityPerParent: null,
      unitMeasurement: null,
      parentPositionId: null
    } : this.data;
    console.log(formdata)
    this.form = this.formBuilder.group(formdata);
  }

  submitSpecification(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value as FlatNode;

    const specification: SendSpecification = {
      positionid: value.positionid,
      parent: value.parentPositionId ?? null,
      description: value.description,
      quantityPerParent: value.quantityPerParent,
      unitMeasurement: value.unitMeasurement
    }

    this.specificationService[this.isNewSpecification ? "createSpecification" : "updateSpecification"](specification).subscribe(
      {next: (result) => {
        console.log('Specification created:', result);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating specification:', error);
      }}
    );

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 }
