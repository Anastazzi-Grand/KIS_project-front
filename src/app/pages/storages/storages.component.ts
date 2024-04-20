import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-storages',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './storages.component.html',
  styleUrl: './storages.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoragesComponent { }
