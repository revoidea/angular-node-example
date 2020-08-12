import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/player.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../../environments/environment'


@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot({ player:playerReducer },{
      runtimeChecks:{ //开发环境下，进行不规范的检测
        strictStateImmutability:true,
        strictActionImmutability:true,
        strictStateSerializability:true,
        strictActionSerializability:true
      }
    }),
    StoreDevtoolsModule.instrument({  //测试工具
      maxAge:20,
      logOnly:environment.production
    })
  ]
})
export class AppStoreModule { }
