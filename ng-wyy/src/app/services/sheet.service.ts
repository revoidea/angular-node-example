/**歌单的服务 */

import { Injectable, Inject } from '@angular/core';
import { ServicesModule,API_CONFIG } from './services.module'
import { Observable } from 'rxjs';
import { SongSheet, Song} from './data-types/common.types'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map, pluck, switchMap } from 'rxjs/internal/operators'
import { queryString} from 'query-string'
import { SongService }  from './song.service'



@Injectable({
  //表示这个service是哪一个模块提供的，'root'指的是appModule提供的
  providedIn: ServicesModule
})
export class SheetService {

  constructor(
    private http:HttpClient,
    @Inject(API_CONFIG) private uri:string,
    private songService :SongService

  ) { }

  //获取轮播图
  // getEnterSinger(args:SingerParams = defaultParams):Observable<Singer[]> {
  //   //传参方式(angular模块自带)
  //   //queryString.stringify(args)----报错
  //   const params = new HttpParams({ fromString:'offset=0&limit=9&cat=5001' }) //因为fromString是字符串类型，需要把args序列化，用第三方库(angular自带)
  //   return this.http.get(this.uri+'artist/list',{ params })
  //   .pipe(map((res:{ artists:Singer[]} )=> res.artists)); //res:{ banners:Banner[]} ：给res声明属性
  // }


  //获取歌单的详情
  getSongSheetDetail(id:number):Observable<SongSheet>{
    const params = new HttpParams().set('id',id.toString());
    return this.http.get(this.uri+'playlist/detail',{ params })
    .pipe(map((res: { playlist:SongSheet }) => res.playlist))
  }

  //播放歌单
  playSheet(id:number):Observable<Song[]>{
    return this.getSongSheetDetail(id)
    .pipe(pluck('tracks'),switchMap(tracks => this.songService.getSongList(tracks))) //pluck操作符：getSongSheetDetail(id)返回的是一个playlist，但只需要tracks属性，就可以用pluck来筛选
  }

  
}
