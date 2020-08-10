/**管理所有界面的模块 */

import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module'

@NgModule({
  declarations: [],
  imports: [
    HomeModule
  ],
  exports:[
    HomeModule
  ]
})
export class PagesModule { }
