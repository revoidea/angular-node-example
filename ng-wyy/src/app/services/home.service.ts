/**首页的服务 */

import { Injectable, Inject } from '@angular/core';
import { ServicesModule,API_CONFIG } from './services.module'
import { Observable } from 'rxjs';
import { Banner, HotTage, SongSheet } from './data-types/common.types';

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

  //获取轮播图
  getBanners():Observable<Banner[]> {
    return this.http.get(this.uri+'banner')
    .pipe(map((res:{ banners:Banner[]} )=> res.banners)); //res:{ banners:Banner[]} ：给res声明属性
  }

  //获取热门标签
  getHotTags():Observable<HotTage[]>{ 
     return this.http.get(this.uri+'playlist/hot')
     .pipe(map((res:{ tags:HotTage[] }) => {
        //数据过多，页面只需展示5个，所以需要对数据进行处理，把数据截取
        //先排序，后截取
        return res.tags.sort((x:HotTage,y:HotTage) => {
          return x.position - y.position;
        }).slice(0,5) 
     }));
  }

  //获取热门歌单
  getPersonalSheetList():Observable<SongSheet[]>{
    return this.http.get(this.uri+'personalized')
    .pipe(map((res:{result:SongSheet[]} ) => res.result.slice(0,16)));
  }
}
