import { Component,signal, computed} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  userName:string =" John Doe"
  collapsed = signal(false)
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(()=> this.collapsed()?'65px':'250px')

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Check if the route starts with '/auth', indicating it's the login page
        this.showHeaderAndSideMenu = !event.url.startsWith('/auth');
      }
    });
  }
}
