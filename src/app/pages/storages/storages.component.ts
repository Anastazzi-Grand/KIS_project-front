import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StorageService, Storage } from '../../services/storages.service';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Observable, map } from 'rxjs';

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
  dataStorages$ = this.storageService.getStorages();

  constructor(private storageService: StorageService) {
    this.dataStorages$.subscribe();
  }
 }
