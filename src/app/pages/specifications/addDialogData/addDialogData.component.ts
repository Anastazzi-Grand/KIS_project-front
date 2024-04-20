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
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-dialog-data',
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
  templateUrl: './addDialogData.component.html',
  styleUrl: './addDialogData.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDialogDataComponent {
  private existingSpec: boolean = false;
  parentSpecification!: number;

  constructor(
    public dialogRef: MatDialogRef<AddDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Specification,
    private specificationService: SpecificationService
  ) { }

  submitSpecification(): void {
    this.specificationService.getSpecificationById(this.data.positionid)
      .pipe(
        catchError(error => {
          // Если произошла ошибка, возвращаем пустой результат
          console.error('Error retrieving specification:', error);
          return of(null);
        })
      )
      .subscribe(existingSpec => {
        // Проверяем, существует ли уже объект с таким же ID
        if (existingSpec !== null) {
          // Объект с таким ID уже существует, выводим сообщение об ошибке
          console.error('Error: Specification with the same ID already exists.');
        } else {
          // Объект с таким ID не существует, можно создать новый
  
          // Если есть родительская спецификация, добавляем ее
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
          this.specificationService.createSpecification(this.data).subscribe(
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

