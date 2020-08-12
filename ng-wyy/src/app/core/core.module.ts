/**
 * 管理（其他)的组件，模块
 * 包括一次性引入的模块，
 */
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module'
import { ShareModule } from '../share/share.module'
import { PagesModule } from '../pages/pages.module'
import { AppStoreModule } from '../store'

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { from } from 'rxjs';

registerLocaleData(zh); //配置语言

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    AppStoreModule,
    AppRoutingModule,
  ],
  exports:[
    ShareModule,
    AppRoutingModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
//只允许被app.module引入
export class CoreModule { 
  
  /**
   * 第一次被appModule引入时，构造函数代码被执行，这时parentModule是不存在的；
   * 当再被其他模块引入，这时parentModule已经存在，所以就会抛出错误，
   * 这样就能保证只被appModule所引入。
   */

   //@SkipSelf()装饰器 表示跳过自身，去到父级去寻找，避免无限循环的问题
   //@Optional()装饰器 表示当CoreModule没找到时，给 parentModule赋值一个null,而不会抛出一个错误
  constructor(@SkipSelf() @Optional() parentModule:CoreModule){ //自已注入
      if(parentModule){
        throw new Error('CoreModule 只能被appModule引入')
      }
  }
}
