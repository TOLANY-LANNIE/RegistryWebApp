import { Component, AfterViewInit, ChangeDetectorRef, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationService } from './services/notification-service/notification-service.service';
import { ToastService } from './services/toast.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit, AfterViewInit {
  items: any[] = [];
  collapsed = signal(false);
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  isSmallScreen = signal(false);
  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationsSubscription: Subscription;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationsSubscription = this.notificationService.notifications$
    .subscribe(notifications => {
      this.notifications = notifications;
      this.calculateUnreadCount();
      this.cdr.detectChanges(); // Force change detection
    });
  }

  ngAfterViewInit() {
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

  /* loadNotifications(): void {
    this.notificationService.getAllNotifications()
      .then(notifications => {
        // Filter notifications where Hide is false
        this.notifications = notifications.filter((notification: { Hide: any; }) => !notification.Hide);
        this.calculateUnreadCount();
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  } */
  

  handleDelete(notification: any): void{
    console.log(`Delete notification of type: ${notification.id}`);
    // Implement the delete logic here
    this.notificationService.delete(notification.id)
      .then(() => {
        console.log(`Notification ${notification.id} marked as hidden.`);
        
        // Update notifications array
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      })
      .catch(error => {
        console.error(`Error marking notification ${notification.id} as hidden:`, error);
      });
  }

  /**
   * Count unread comments
   */
  calculateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(notification => !notification.Read).length;
  }

  handleHide(notification: any): void {
   
    this.notificationService.markAsHidden(notification)
      .then(() => {
        console.log(`Notification ${notification.id} marked as hidden.`);
        
        // Update notifications array
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      })
      .catch(error => {
        console.error(`Error marking notification ${notification.id} as hidden:`, error);
      });
  }

  markNotificationsAsRead(): void {
    const unreadNotifications = this.notifications.filter(notification => !notification.Read);
    unreadNotifications.forEach(notification => {
      notification.Read = true; // Ensure property name matches backend
      this.notificationService.markAsRead(notification.id).then(() => {
       // console.log(`Notification ${notification.id} marked as read.`);
        this.calculateUnreadCount(); // Recalculate unread count after marking as read
        this.cdr.detectChanges(); // Force change detection
      }).catch(error => {
        console.error(`Error marking notification ${notification.id} as read:`, error);
      });
    });
  }

  checkInviteUrl() {
    return window.location.href.indexOf('invite') > -1;
  }


  checkAuthUrl() {
    return window.location.href.indexOf('login') > -1;
  }


  /**
   * Format the date string to MM/DD/YYYY
   * @param date 
   * @returns 
   */
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }
}
