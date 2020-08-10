
/**
 * 存放服务
 * 主要是一些http的服务
 */

import { NgModule, InjectionToken } from '@angular/core';

//声明一个token（常量）,传一个参数作为token的标识 ---令牌
export const API_CONFIG = new InjectionToken('ApiConfigToken')

@NgModule({
  declarations: [],
  imports: [
   
  ],
  providers:[
    /**angular提供的每一个服务，都有一个令牌（也可以写成字符串，但不推荐），和对应的值：可能是一个对象，也有可能是一个类 */
    { provide:API_CONFIG,useValue:'http://localhost:3000/' } 
  ]
})
export class ServicesModule { }
