import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store,select } from '@ngrx/store'
import { AppStoreModule } from 'src/app/store/index';
import { getSongList, getPlayList, getCurrentIndex,getPlayer, getCurrentSong, getPlayMode } from '../../../store/selectors/player.selector'
import { Song } from 'src/app/services/data-types/common.types';
import { PlayMode } from './player.type';
import { SetCurrentIndex, SetPlayMode, SetPlayList } from 'src/app/store/actions/player.actions';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle } from 'src/app/utils/array';

//模式类型
const modeTypes:PlayMode[] =[{
    type:'loop',
    label:'循环'
},{
    type:'singleLoop',
    label:'单曲循环'
},{
    type:'random',
    label:'随机'
}];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {

  //播放进度条比例
  percent = 0;
  //缓冲进度条比例
  bufferPercent = 0;

  songList:Song[];
  playList:Song[];
  currentIndex:number;
  currentSong:Song;

  duration: number;//歌曲播放总时长
  currentTime:number;//歌曲播放的当前时间

  //播放状态
  playing = false;
  //是否可以播放
  songReady = false;

  //音量
  volume = 60;

  //是否显示音量面板
  showVolumePanel = false;

  //是否点击的是音量面板本身
  selfClick = false;

  //用于window绑定事件
  private winClick:Subscription;

  //当前模式
  currentMode:PlayMode;
  //模式点击次数
  modeCount = 0;

  @ViewChild('audio',{ static:true }) private audio:ElementRef;
  private audioEl :HTMLAudioElement;

  constructor(
    private store$:Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc:Document
  ) { 

    //监听
    const appStore$ = this.store$.pipe(select(getPlayer)); //写'player'会报错
    appStore$.pipe(select(getSongList)).subscribe(list => {
      console.log("getSongList:",list)
      this.songList = list;
    });
    appStore$.pipe(select(getPlayList)).subscribe(list => {
      console.log("getPlayList:",list)
      this.playList = list;
    });
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => {
      console.log("getCurrentIndex:",index)
      this.currentIndex = index;
    });
    appStore$.pipe(select(getPlayMode)).subscribe(mode => {
      console.log("getPlayMode:",mode)
      this.currentMode = mode;
      if(this.songList){
         let list = this.songList.slice();
         //随机模式更改playList
         if(mode.type === 'random'){
            list = shuffle(this.songList);
            //改变歌曲播放列表，但不能影响正在播放的歌曲
            this.updateCurrentIndex(list,this.currentSong);
            //改变歌曲播放列表
            this.store$.dispatch(SetPlayList({ playList:list}));
         }
         console.log("list",list)
      }
    
    });
    appStore$.pipe(select(getCurrentSong)).subscribe(song => {
      console.log("getCurrentSong:",song)
      if(song){
        this.currentSong = song;
        this.duration = song.dt / 1000;
      }

    });


    // const stateArr = [{
    //   type:getSongList,
    //   cb:list => this.watchList(list,'songList')
    // },{
    //   type:getPlayList,
    //   cb:list => this.watchList(list,'playList')
    // },{
    //   type:getCurrentIndex,
    //   cb:index => this.watchListCurrentIndex(index)
    // },
    // {
    //   type:getCurrentIndex,
    //   cb:index => this.watchListCurrentIndex(index)
    // }];
    
    // stateArr.forEach(item => {
    //   appStore$.pipe(select(item.type)).subscribe(item.cb);
    // });
  }

  ngOnInit(): void {
      console.log('audio:',this.audio.nativeElement);
      this.audioEl = this.audio.nativeElement;
  }

 

  private watchList(list:Song[],type:string){
     console.log('list',list);
     this[type] = list;
  }

  private watchListCurrentIndex(index:number){
    console.log('index',index);
    this.currentIndex = index;
  }

  //监听播放模式
  private watchPlayMode(mode:PlayMode){
    console.log('mode',mode);
  }

  //监听当前播放歌曲
  private watchCurrentSong(song:Song){
    if(song){
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
    console.log('song',song)
  }


  //更新当前索引
  private updateCurrentIndex(list:Song[],song:Song){
      const newIndex = list.findIndex(item => item.id === song.id);
      this.store$.dispatch(SetCurrentIndex({ currentIndex:newIndex }));
  }


  //模式切换
  changeMode(){
    //模式点击次数
    //modeTypes[++this.modeCount % 3];

     this.store$.dispatch(SetPlayMode({ playMode :modeTypes[++this.modeCount % 3]}));
  }

  //播放进度
  /**
   * 问题：歌曲在播放时拖拉进度条，会出现卡顿现象，所以需要在鼠标抬起时，就触发事件，因此需要在wy-slider组件的onDragEnd()里面需要写一个Output的wyOnAfterChange事件
   * @param per 得到值是百分比
   */
  onPercentChange(per){
    //必需有歌曲在播放时，才设置Percent，否则会出错
    if(this.currentSong){
      this.audioEl.currentTime = this.duration * (per / 100);
      //console.log('per:',per);
    }
    
    
  }

  //控制音量（监听音量变化）
  onVolumeChange(per:number){
    //音量值：0-1之间，per的值：1-100之间，因此需要 /100；
    this.audioEl.volume = per / 100; 
  }

  //控制音量面板
  togglerVolPanel(evt:MouseEvent){
    //阻止冒泡
    //evt.stopPropagation();   
    this.togglerPanel();
  }

  //音量面板显示或隐藏
  togglerPanel(){
    this.showVolumePanel = !this.showVolumePanel;
    if(this.showVolumePanel){
      //定义一个全局绑定事件
      this.bindDocumentClickListener();
    }else{
      this.unbindDocumentClickListener();
    }
  }

  //绑定事件
  private bindDocumentClickListener(){
    if(!this.winClick){
       this.winClick = fromEvent(this.doc,'click').subscribe(() => {
         if(!this.selfClick){ //说明点击了播放器以外的部分
            this.showVolumePanel = false;
            this.unbindDocumentClickListener();
         }
         this.selfClick = false;
       });
    }
  }

  //解绑事件
  private unbindDocumentClickListener(){
    if(this.winClick){
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  // 播放/暂停
  onToggle(){ 
    /*因为会出现选择歌曲不播放的情况，需要对此判断。（onPlaySheet()设置默认的是选择歌曲并同时播放）*/
    if(!this.currentSong){
      if(this.playList.length){
        this.updateIndex(0);
      }
    }else{
      if(this.songReady){
        this.playing = !this.playing;
        if(this.playing){
          this.audioEl.play();
        }else{
          this.audioEl.pause();
        }
      }
    }
  }

  //上一首
  onPrev(index:number){
    //是否可以播放
    if(!this.songReady){return;}

    if(this.playList.length ===1 ){
      //如歌单只有一首歌，单曲循环
      this.loop();
    }else{
      //获取新的索引
      const newIndex = index <= 0 ? this.playList.length -1 :index;
      //更新索引
      this.updateIndex(newIndex);
    }
  }

  //下一首
  onNext(index:number){
    //是否可以播放
    if(!this.songReady){return;}

    if(this.playList.length ===1 ){
      //如歌单只有一首歌，单曲循环
      this.loop();
    }else{
      //获取新的索引
      const newIndex = index >= this.playList.length ? 0 :index;
      //更新索引
      this.updateIndex(newIndex);
    }
   
  }

  //歌曲播放结束时
  onEnded(){
    //停止播放
    this.playing = false;
    //单曲循环
    if(this.currentMode.type === 'singleLoop'){
      this.loop();
    }else{
      this.onNext(this.currentIndex + 1);
    } 
  }

  //单曲循环
  private loop(){
    this.audioEl.currentTime = 0;
    this.play();
  }

  //更新歌曲索引
  private updateIndex(index:number){
    this.store$.dispatch(SetCurrentIndex({ currentIndex:index }));
    this.songReady = false;
  }

  //点击播放
  onCanplay(){
    this.songReady = true;
    this.play();
  }

  //动态更改歌曲时间
  /**
   * 时间发生变化时，滑块的位置,播放进度条比例，也应该发生变化
   * @param e 
   */
  onTimeUpdate(e:Event){
    //更改时间
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    //播放进度位置
    this.percent = (this.currentTime / this.duration) * 100; 
    //缓冲进度的设置
    const buffered = this.audioEl.buffered;
    //因为歌曲没有播放的时候，是获取不到buffered
    if(buffered.length && this.bufferPercent < 100 ){
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }


  //播放
  private play(){
    this.playing = true;
    this.audioEl.play();
  }
  
  //获取当前播放歌曲的封面图
  get picUrl():string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
