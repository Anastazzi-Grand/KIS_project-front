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
  selector: 'app-delete-dialog-data',
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
  templateUrl: './deleteDialogData.component.html',
  styleUrl: './deleteDialogData.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogDataComponent {
  parentSpecification!: number;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private specificationService: SpecificationService
  ) { }

  submitSpecification(): void {
    this.specificationService.deleteSpecification(this.data)
      .subscribe(
        () => {
          console.log('Specification deleted successfully.');
          this.dialogRef.close(true);
        }
      );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
