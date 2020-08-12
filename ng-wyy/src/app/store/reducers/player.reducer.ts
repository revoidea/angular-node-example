/**定义一些播放器的元数据 */

import { PlayMode } from "../../share/wy-ui/wy-player/player.type";
import { Song } from '../../services/data-types/common.types'
import { createReducer,on,Action } from '@ngrx/store'
import { SetPlaying, SetPlayList, SetSongList, SetPlayMode, SetCurrentIndex } from "../actions/player.actions";


//播放的数据类型
export type PlayState = {
    //播放状态
    playing : boolean;
    //播放模式
    playMode: PlayMode;
    //歌曲列表
    songList:Song[];
    //播放列表
    playList:Song[];
    //当前正在播放的索引
    currentIndex:number;
}

//播放器的初始数据
export const initialState:PlayState = {
    playing:false,
    songList:[],
    playList:[],
    playMode:{ type:'loop',label:'随机' },
    currentIndex:-1 //因为不知道播放的是哪首歌
}

//注册播放动作
export const reducer = createReducer(
    initialState,
    on(SetPlaying, (state,{ playing })=> ({ ...state, playing })),
    on(SetPlayList, (state,{ playList })=> ({ ...state, playList })),
    on(SetSongList, (state,{ songList })=> ({ ...state, songList })),
    on(SetPlayMode, (state,{ playMode })=> ({ ...state, playMode })),
    on(SetCurrentIndex, (state,{ currentIndex })=> ({ ...state, currentIndex })),
);



export function playerReducer(state:PlayState,action:Action){
    return reducer(state,action)
}