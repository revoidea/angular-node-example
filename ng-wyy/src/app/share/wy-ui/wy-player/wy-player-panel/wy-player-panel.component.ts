import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';

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
  }
}
