import { CommonModule, DatePipe } from '@angular/common';
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
import { StatisticStorage, StorageService, Storage } from '../../../services/storages.service';
import { map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-statistics-storage',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, MatTableModule,
    MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe
  ],
  templateUrl: './statistics-storage.component.html',
  styleUrl: './statistics-storage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}, provideNativeDateAdapter(), DatePipe],
})
export class StatisticsStorageComponent {
  private datePipe = inject(DatePipe);

  data = inject<Storage>(MAT_DIALOG_DATA)

  service = inject(StorageService);

  range = new FormGroup({
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
  });

  data$ = this.range.valueChanges.pipe(
    startWith(null),
    map((range) => {
      return {
        fromDate: range?.fromDate?.toLocaleDateString() ?? '',
        toDate: range?.toDate?.toLocaleDateString() ?? ''
      }
    }),
    switchMap((params) => this.service.getStorageHistoryBySpecificationId(this.data.specificationId.positionid, params)),
    shareReplay(1)
  )

  displayedColumns = ["date", "incoming", "outgoing", "currentRest"];



  constructor() {
    this.range.valueChanges.pipe().subscribe((a) => console.log(a))
  }
}
