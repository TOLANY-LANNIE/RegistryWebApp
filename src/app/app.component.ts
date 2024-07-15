import { Component, signal, computed } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationService } from './services/notification/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items: any[] = [];
  collapsed = signal(false);
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');

  constructor(
    private router: Router, 
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {
    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.collapsed.set(true); // Collapse the sidenav for small screens
        }
      });
  }

  ngOnInit(): void {
    this.notificationService.getItems().subscribe((items: any[]) => {
      // Compare the new items with the existing ones to detect new additions
      if (this.items.length && items.length > this.items.length) {
        const newItem = items[items.length - 1];
        this.snackBar.open(`New item added: ${newItem.name}`, 'Close', {
          duration: 3000
        });
      }
      this.items = items;
    });
  }

  checkInviteUrl() {
    return window.location.href.indexOf('invite') > -1;
  }
}
