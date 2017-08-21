import { NgModule }      from '@angular/core'

import { SharedModule }   from '../shared/shared.module'
import { ItemsRoutingModule } from './items-routing.module'

@NgModule({
  imports:      [ ItemsRoutingModule, SharedModule ],
  declarations: [ ItemsRoutingModule.components ]
})
export class ItemsModule { }