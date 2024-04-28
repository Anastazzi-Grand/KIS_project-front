import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { SpecificationService } from './services/specifications.service';
import { StorageService } from './services/storages.service';
import { OrderService } from './services/orders.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, CommonModule, RouterLink, RouterLinkActive],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'KIS-front';
}
