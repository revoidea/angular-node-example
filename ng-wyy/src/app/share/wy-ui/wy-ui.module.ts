
//存放网页共用的ui组件

import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../play-count.pipe'


@NgModule({
  declarations: [SingleSheetComponent,PlayCountPipe],
  imports: [
    
  ],
  exports:[
    SingleSheetComponent,
    PlayCountPipe
  ]
})
export class WyUiModule { }
