import { Routes } from '@angular/router';
import { SpecificationsComponent } from './pages/specifications/specifications.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { StoragesComponent } from './pages/storages/storages.component';

export const routes: Routes = [{
    path: '',
    redirectTo: 'specifications',
    pathMatch: 'full'
},
{
    path: 'orders',
    component: OrdersComponent
},
{
    path: 'storages',
    component: StoragesComponent
},
{
    path: 'specifications',
    component: SpecificationsComponent
}
];
