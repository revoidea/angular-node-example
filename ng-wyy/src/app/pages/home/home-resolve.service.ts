import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, forkJoin } from 'rxjs'
import { HomeService } from 'src/app/services/home.service'
import { SingerService } from 'src/app/services/singer.service'
import { Banner, HotTage, Singer, SongSheet } from 'src/app/services/data-types/common.types'
import {  first } from 'rxjs/internal/operators'


type HomeDataType = [Banner[],HotTage[],SongSheet[],Singer[]]


@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor( private homeService:HomeService,private singerService:SingerService) {}

  //没有路由参数，不需要 route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  resolve():Observable<HomeDataType> {

    //接收一个数组，数组的每个参数都是返回一个Observable对象
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger()
    ]).pipe(first());  //取第一个流
    
  }
}