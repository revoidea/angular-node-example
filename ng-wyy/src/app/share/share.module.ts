/**
 * 管理全局经常共用的一些模块，指令，组件
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[ //需要导出，别的地方才可以使用
    FormsModule
  ]
})
export class ShareModule { }
