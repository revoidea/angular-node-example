import { Injectable, Inject } from '@angular/core';
import { ServicesModule,API_CONFIG } from './services.module'
import { Observable } from 'rxjs';
import { Singer} from './data-types/common.types'
import { HttpClient, HttpParams } from '@angular/common/http'
import { map } from 'rxjs/internal/operators'
import { queryString} from 'query-string'


//定义传入参的类型
type SingerParams = {
  offset:number ;//分页
  limit:number;//页大小
  cat?:string;//分类（可选）
}

//默认参数
const defaultParams:SingerParams = {
  offset:0,
  limit:9,
  cat:'5001'
} 

@Injectable({
  //表示这个service是哪一个模块提供的，'root'指的是appModule提供的
  providedIn: ServicesModule
})
export class SingerService {

  constructor(
    private http:HttpClient,
    @Inject(API_CONFIG) private uri:string

  ) { }

  //获取轮播图
  getEnterSinger(args:SingerParams = defaultParams):Observable<Singer[]> {
    //传参方式(angular模块自带)
    //queryString.stringify(args)----报错
    const params = new HttpParams({ fromString:'offset=0&limit=9&cat=5001' }) //因为fromString是字符串类型，需要把args序列化，用第三方库(angular自带)
    return this.http.get(this.uri+'artist/list',{ params })
    .pipe(map((res:{ artists:Singer[]} )=> res.artists)); //res:{ banners:Banner[]} ：给res声明属性
  }

  
}
