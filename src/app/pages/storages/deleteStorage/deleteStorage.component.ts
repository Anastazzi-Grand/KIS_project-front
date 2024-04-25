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
import { StorageService } from '../../../services/storages.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-delete-storage',
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
  templateUrl: './deleteStorage.component.html',
  styleUrl: './deleteStorage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteStorageComponent { 
  constructor(
    public dialogRef: MatDialogRef<DeleteStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private storageService: StorageService
  ) { }

  submitStorage(): void {
    this.storageService.deleteStorage(this.data)
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
