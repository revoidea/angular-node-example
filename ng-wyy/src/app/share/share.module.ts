/**
 * 管理全局经常共用的一些模块，指令，组件
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NzInputModule
  ],
  exports:[ //需要导出，别的地方才可以使用
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    NzInputModule
  ]
})
export class ShareModule { }
