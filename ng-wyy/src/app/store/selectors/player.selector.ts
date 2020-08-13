import { PlayState } from "../reducers/player.reducer";
import { createSelector,createFeatureSelector } from '@ngrx/store'

//先拿到playerState的数据
const selectPlayerStates = (state:PlayState ) => state;
export const getPlayer = createFeatureSelector<PlayState>('player');
export const getPlaying = createSelector(selectPlayerStates,(state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerStates,(state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerStates,(state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerStates,(state: PlayState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayerStates,(state: PlayState) => state.currentIndex);

//获取当前播放的歌曲
export const getCurrentSong = createSelector(selectPlayerStates,({playList,currentIndex}: PlayState) => playList[currentIndex]);