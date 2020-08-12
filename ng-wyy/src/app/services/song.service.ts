/**歌曲的服务 */

import { Injectable, Inject } from '@angular/core';
import { ServicesModule,API_CONFIG } from './services.module'
import { Observable } from 'rxjs';
import { SongSheet, SongUrl, Song} from './data-types/common.types'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/internal/operators'
import { queryString} from 'query-string'




@Injectable({
  //表示这个service是哪一个模块提供的，'root'指的是appModule提供的
  providedIn: ServicesModule
})
export class SongService {

  constructor(
    private http:HttpClient,
    @Inject(API_CONFIG) private uri:string

  ) { }

  //获取轮播图
  // getEnterSinger(args:SingerParams = defaultParams):Observable<Singer[]> {
  //   //传参方式(angular模块自带)
  //   //queryString.stringify(args)----报错
  //   const params = new HttpParams({ fromString:'offset=0&limit=9&cat=5001' }) //因为fromString是字符串类型，需要把args序列化，用第三方库(angular自带)
  //   return this.http.get(this.uri+'artist/list',{ params })
  //   .pipe(map((res:{ artists:Singer[]} )=> res.artists)); //res:{ banners:Banner[]} ：给res声明属性
  // }


  //获取歌曲路径
  getSongUrl(ids:string):Observable<SongUrl[]>{
    const params = new HttpParams().set('id',ids);
    return this.http.get(this.uri+'song/url',{ params })
    .pipe(map((res: { data:SongUrl[] }) => res.data))
  }

  // getSongList(songs:Song | Song[]): Observable<Song[]>{
  //   //因为songs可能是单个也可是多个，所以统一为数组
  //   const songArr = Array.isArray(songs) ? songs.slice() : [songs];
  //   //拼接ids字符串 , ','连接
  //   const ids = songArr.map(item =>item.id).join(',');

  //   //使用create创建一个数据流
  //   return Observable.create(observer => {
  //     //调用获取歌曲路径接口，并处理数据，对数据进行拼接
  //     this.getSongUrl(ids).subscribe(urls => {
  //         this.generateSongList(songArr,urls)
  //     })
  //   })
   
  // }


  //简化版
  getSongList(songs:Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr,urls)));
  }


  //拼接方法
  private generateSongList(songs:Song[],urls:SongUrl[]):Song[]{
    const result = []
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id).url;
      if(url){
        result.push({...song,url}); //返回的就是Song对象的数组
      }
    });
    // console.log("song-result:",result);
    return result;
  }
}
