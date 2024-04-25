import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { SendStorage, StorageService, Storage } from '../../services/storages.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ChangeStorageComponent } from './changeStorage/changeStorage.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, takeUntil } from 'rxjs';
import { DeleteStorageComponent } from './deleteStorage/deleteStorage.component';

@Component({
  selector: 'app-storages',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule
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

  destroyRef = inject(DestroyRef)

  constructor(private storageService: StorageService, public dialog: MatDialog) {
    this.dataStorages$.subscribe();
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

  openDeleteStoragenDialog(node: Storage): void {
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
      console.log('The delete specification dialog was closed');
    });
  }
 }
