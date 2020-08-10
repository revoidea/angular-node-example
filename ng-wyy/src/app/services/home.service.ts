import { Injectable, Inject } from '@angular/core';
import { ServicesModule,API_CONFIG } from './services.module'
import { Observable } from 'rxjs';
import { Banner } from './data-types/common.types';

import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/internal/operators'

@Injectable({
  //表示这个service是哪一个模块提供的，'root'指的是appModule提供的
  providedIn: ServicesModule
})
export class HomeService {

  constructor(
    private http:HttpClient,
    @Inject(API_CONFIG) private uri:string

  ) { }

  getBanners():Observable<Banner[]> {
    return this.http.get(this.uri+'banner')
    .pipe(map((res:{ banners:Banner[]} )=> res.banners)) //res:{ banners:Banner[]} ：给res声明属性
  }
}
