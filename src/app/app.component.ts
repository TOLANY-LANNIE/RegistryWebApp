import { Component,signal, computed} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  collapsed = signal(false)
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(()=> this.collapsed()?'65px':'250px')

  constructor(private router: Router) {}

  checkInviteUrl(){
    return window.location.href.indexOf('invite') > -1;
  }
}
