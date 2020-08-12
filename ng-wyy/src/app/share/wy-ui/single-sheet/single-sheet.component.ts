import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.component.less'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {

  //输入值
  @Input() sheet:SongSheet;

  @Output() onPlay = new EventEmitter<number>();//发射一个onPlay事件

  constructor() { }

  ngOnInit(): void {
  }

  //播放
  playSheet(id:number){
    this.onPlay.emit(id);
  }


}
