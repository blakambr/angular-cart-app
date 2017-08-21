import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router'

import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy'

const app_routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: '/items' },
  { path: 'customers', loadChildren: 'app/customers/customers.module#CustomersModule'},
  { path: 'customers/:id', loadChildren: 'app/customer/customer.module#CustomerModule'},
  { path: 'orders', loadChildren: 'app/orders/orders.module#OrdersModule'},
  { path: 'items', loadChildren: 'app/items/items.module#ItemsModule'},
  { path: '**', pathMatch:'full', redirectTo: '/items' } //catch any unfound routes and redirect to home page
];

@NgModule({
  imports: [ RouterModule.forRoot(app_routes, { preloadingStrategy: PreloadAllModules }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
