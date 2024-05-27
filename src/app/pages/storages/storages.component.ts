import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { SendStorage, StorageService, Storage } from '../../services/storages.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ChangeStorageComponent } from './changeStorage/changeStorage.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs';
import { DeleteStorageComponent } from './deleteStorage/deleteStorage.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { StatisticsStorageComponent } from './statistics-storage/statistics-storage.component';
import { DeficitStorageComponent } from './deficitStorage/deficitStorage.component';

@Component({
  selector: 'app-storages',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, 
    MatDatepickerModule, MatIconModule, ReactiveFormsModule, MatTableModule
  ],
  templateUrl: './storages.component.html',
  styleUrl: './storages.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoragesComponent {

  refresh$ = new BehaviorSubject(undefined);
  
  dataStorages$ = this.refresh$.pipe(
    switchMap(() => this.storageService.getStorages()),
    shareReplay(1)
  );

  dateControl = new FormControl(new Date());

  destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['positionid', 'description', 'quantity', 'unitMeasurement'];
element: any;

  constructor(private storageService: StorageService, public dialog: MatDialog) {
    this.dateControl.valueChanges.pipe(startWith(this.dateControl.value), takeUntilDestroyed()).subscribe(date => console.log(date));
  }

  openAddStorageDialog(): void {
    const dialogRef = this.dialog.open(ChangeStorageComponent, {
      width: '400px', 
      data: null 
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The add storage dialog was closed');
    });
  }

  openChangeStorageDialog(node: Storage): void {
    const dialogRef = this.dialog.open(ChangeStorageComponent, {
      width: '400px',
      data: node
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The change storage dialog was closed');
    });
  }

  openDeleteStorageDialog(node: Storage): void {
    const dialogRef = this.dialog.open(DeleteStorageComponent, {
      width: '400px',
      data: node.idStorage
    });

    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result) {
        this.refresh$.next(undefined);
      }
      console.log('The delete storage dialog was closed');
    });
  }

  onClick(row: Storage) {
    const dialog =  this.dialog.open(StatisticsStorageComponent, {
      width: '90vw',
      data: row
    });

    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      console.log('The statistic storage dialog was closed');
    });
  }

  checkDeficit(): void{
    const dialog =  this.dialog.open(DeficitStorageComponent, {
      width: '150vw',
      data: null 
    });

    dialog.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      console.log('The statistic storage dialog was closed');
    });
  }
 }
