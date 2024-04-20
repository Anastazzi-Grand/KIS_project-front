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
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Specification, SpecificationService } from '../../../services/specifications.service';
import { catchError, of } from 'rxjs';

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
  ],
  templateUrl: './changeDialogData.component.html',
  styleUrl: './changeDialogData.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDialogDataComponent {
  parentSpecification!: number;

  constructor(
    public dialogRef: MatDialogRef<ChangeDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Specification,
    private specificationService: SpecificationService
  ) { }

  submitSpecification(): void {
    this.specificationService.getSpecificationById(this.data.positionid)
      .pipe(
        catchError(error => {
          console.error('Error retrieving specification:', error);
          return of(null);
        })
      )
      .subscribe(existingSpec => {
        if (existingSpec === null) {
          console.error('Error: Specification with that ID doesn`t exist.');
        } else {
            if (this.parentSpecification) {
            const parentSpecification: Specification = {
              positionid: this.parentSpecification,
              parent: null,
              description: '',
              quantityPerParent: 0,
              unitMeasurement: ''
            };
  
            this.data.parent = parentSpecification;
          } else {
            this.data.parent = null;
          }
  
          // Создаем новую спецификацию
          this.specificationService.updateSpecification(this.data.positionid, this.data).subscribe(
            (result) => {
              console.log('Specification created:', result);
              this.dialogRef.close(result);
            },
            (error) => {
              console.error('Error creating specification:', error);
            }
          );
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 }
