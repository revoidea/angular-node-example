/*定义自定义数据的数据类型*/


//轮播图
export type Banner = {
    targetId:number;
    imageUrl:string;
    url:string;
}

//热门标签
export type HotTage = {
    id:number;
    name:string;
    position:number;
}

//热门歌单
export type SongSheet = {
    id:number;
    name:string;
    playCount:number; //播放量
    picUrl:string;
}

//歌手
export type Singer = {
    id:number;
    name:string;
    picUrl:string;
    albumSize:number;
}