import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTage, SongSheet, Singer } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
// import { HomeService } from 'src/app/services/home.service'
// import { SingerService } from 'src/app/services/singer.service'
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service'
import { Store } from '@ngrx/store'
import { AppStoreModule } from 'src/app/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.actions';

 


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  public banners:Banner[];
  public hotTags:HotTage[];
  public songSheetList:SongSheet[];
  public singers:Singer[];
  carouselActiveIndex = 0;

  //轮播组件的实例
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
  
  //注入home服务
  constructor(
    // private homeService:HomeService,
    // private singerService:SingerService,
    //注入Route这个类
    private route:ActivatedRoute,
    private sheetService:SheetService,
    private store$:Store<AppStoreModule>
  ) { 
    
    //是一个Observable对象
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners,tags,sheets,singers]) => {
      this.banners = banners;
      this.hotTags = tags;
      this.songSheetList = sheets;
      this.singers = singers;

    })

    //  this.getBanners()
    //  this.getHotTags()
    //  this.getPersonalizedSheet()
    //  this.getEnterSinger()
  }

  //在本组件里面调用的，声明private

  // //获取轮播图
  // private getBanners(){
  //   this.homeService.getBanners().subscribe(banners => {
  //     this.banners = banners;
  //   })
  // }

  // //获取热门标签
  // private getHotTags(){
  //   this.homeService.getHotTags().subscribe(tags => {
  //     this.hotTags = tags;
  //   })
  // }

  // //获取热门歌单
  // private getPersonalizedSheet(){
  //   this.homeService.getPersonalSheetList().subscribe(sheets => {
  //     this.songSheetList = sheets;
  //   })
  // }


  // private getEnterSinger(){
  //   this.singerService.getEnterSinger().subscribe(singers => {
  //      this.singers = singers;
  //   })
  // }


  ngOnInit(): void {
  }

  onBeforeChange({ to }){
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type:string){//type:'pre' | 'next' 
    this.nzCarousel[type]();
  }

  //播放事件
  onPlaySheet(id:number){
    console.log('id',id)
    this.sheetService.playSheet(id).subscribe(list => {
      // console.log("res",list)
      //执行动作
      this.store$.dispatch(SetSongList({ songList: list.slice(3) }));
      this.store$.dispatch(SetPlayList({ playList:list.slice(3) }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex:0 }));

    }) 
  }
}
