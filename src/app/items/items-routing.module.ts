import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ItemsComponent } from './items.component'
import { ItemsCardComponent } from './items-card.component'

const routes: Routes = [
  { path: '', component: ItemsComponent }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ItemsRoutingModule {
  static components = [ ItemsComponent, ItemsCardComponent ]
}