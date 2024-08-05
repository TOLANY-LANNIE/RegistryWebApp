import { Component, signal, computed,AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationService } from './services/notification-service/notification-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './services/toast.service';
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
  isSmallScreen = signal(false);

  constructor(
    private router: Router, 
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private toastService:ToastService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.notificationService.detectChanges().subscribe((items: any[]) => {
      // Compare the new items with the existing ones to detect new additions
      if (this.items.length && items.length > this.items.length) {
        const newItem = items[items.length - 1];
        this.showInfo();
      }
      this.items = items;
    });
  }

  ngAfterViewInit(){
    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.collapsed.set(true); // Collapse the sidenav for small screens
          this.isSmallScreen.set(true);
        } else {
          this.collapsed.set(false); // Expand the sidenav for larger screens
          this.isSmallScreen.set(false);
        }
      });
  }

  handleDelete(type: string) {
    console.log(`Delete notification of type: ${type}`);
    // Implement the delete logic here
  }

  /**
   * Show that a new attendee has signed up
   */
  showInfo() {
    this.toastService.showInfo('Notification','New attendee signed up');
}

  checkInviteUrl() {
    return window.location.href.indexOf('invite') > -1;
 }
}
