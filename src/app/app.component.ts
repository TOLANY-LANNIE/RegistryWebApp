import { Component, signal, computed } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  collapsed = signal(false);
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) {
    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.collapsed.set(true); // Collapse the sidenav for small screens
        }
      });
  }

  checkInviteUrl() {
    return window.location.href.indexOf('invite') > -1;
  }
}
