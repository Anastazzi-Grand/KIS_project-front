import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SendStorage, StorageService } from '../../../services/storages.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deficit-storage',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, 
    MatDatepickerModule, MatIconModule, ReactiveFormsModule, MatTableModule
  ],
  templateUrl: './deficitStorage.component.html',
  styleUrl: './deficitStorage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeficitStorageComponent {

  refresh$ = new BehaviorSubject(undefined);

  dataDeficit$ = this.refresh$.pipe(
    switchMap(() => this.storageService.getDeficitStorages()),
    shareReplay(1)
  );

  destroyRef = inject(DestroyRef);

  dateControl = new FormControl(new Date());

  displayedColumns: string[] = ['positionid', 'description', 'quantity', 'unitMeasurement'];
  element: any;

  constructor(private storageService: StorageService, public dialog: MatDialog) {
    this.dataDeficit$.subscribe((storages) => {
      console.log('Данные в dataDeficit$:', storages);
    });
  }
}
