import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module'
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  
})
export class HomeModule { }
