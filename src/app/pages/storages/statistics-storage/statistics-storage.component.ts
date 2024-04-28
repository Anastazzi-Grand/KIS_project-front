import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { StatisticStorage, StorageService } from '../../../services/storages.service';
import { of, shareReplay, switchMap } from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-statistics-storage',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, MatTableModule
  ],
  templateUrl: './statistics-storage.component.html',
  styleUrl: './statistics-storage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsStorageComponent {
  data = inject(MAT_DIALOG_DATA)

  service = inject(StorageService);

  data$ = of(true).pipe(
    switchMap(() => this.service.getStorageHistoryBySpecificationId(this.data.specificationId.positionid)),
    shareReplay(1)
  )

  displayedColumns = ["date", "incoming", "outgoing", "currentRest"];
 }
