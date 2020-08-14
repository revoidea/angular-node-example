import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit,OnChanges {


  @Input() songList:Song[]; //歌曲列表
  @Input() currentSong:Song; //当前播放歌曲
  @Input() currentIndex:number;//当前播放歌曲的索引
  @Input() show:boolean;//播放歌曲面板是否显示

  @Output() onClose = new EventEmitter<void>(); //面板关闭按钮事件
  @Output() onChangeSong = new EventEmitter<Song>();//歌曲列表中切换歌曲事件

  @ViewChildren(WyScrollComponent) private myScroll:QueryList<WyScrollComponent> ;

   
  constructor() { }

  ngOnInit(): void {
  }


  ngOnChanges(changes:SimpleChanges):void {
    //监听属性
    if(changes['songList']){
      console.log("songlist:",this.songList);
    }
    if(changes["currentSong"]){
      console.log("currentSong:",this.currentSong);
    }
    if(changes["show"]){
      //组件不是第一次加载，并且show = true时，去使ts重新刷新
      if(!changes["show"].firstChange && this.show){
        this.myScroll.first.refreshScroll();
      }
    
    }

  }
}
