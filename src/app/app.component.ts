import { Component, AfterViewInit, ChangeDetectorRef, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationService } from './services/notification-service/notification-service.service';
import { ToastService } from './services/toast.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SearchService } from './services/search/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('searchFieldAnimation', [
      state('hidden', style({
        transform: 'translateX(100%)',
        opacity: 0,
        width: '0px',
        overflow: 'hidden'
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1,
        width: '*'
      })),
      transition('hidden => visible', [
        animate('300ms ease-in-out')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  items: any[] = [];
  collapsed = signal(false);
  showHeaderAndSideMenu: boolean = true;
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  isSmallScreen = signal(false);
  notifications: any[] = [];
  unreadCount: number = 0;
  searchQuery = signal(''); // Use signal for the search query
  searchFieldVisible = signal(false);
  private notificationsSubscription: Subscription;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private toastService: ToastService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.notificationsSubscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.calculateUnreadCount();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.collapsed.set(true);
        this.isSmallScreen.set(true);
      } else {
        this.collapsed.set(false);
        this.isSmallScreen.set(false);
      }
    });
  }

  toggleSearchField() {
    this.searchFieldVisible.update(visible => !visible);
  }

  /**
   * Search field function 
   */
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    this.searchService.setSearchQuery(query);
  }
  
  handleDelete(notification: any): void {
    this.notificationService.delete(notification.id).then(() => {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
    }).catch(error => {
      console.error(`Error deleting notification ${notification.id}:`, error);
    });
  }

  calculateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(notification => !notification.Read).length;
  }

  markNotificationsAsRead(): void {
    const unreadNotifications = this.notifications.filter(notification => !notification.Read);
    unreadNotifications.forEach(notification => {
      notification.Read = true;
      this.notificationService.markAsRead(notification.id).then(() => {
        this.calculateUnreadCount();
        this.cdr.detectChanges();
      }).catch(error => {
        console.error(`Error marking notification ${notification.id} as read:`, error);
      });
    });
  }

  checkInviteUrl(): boolean {
    return window.location.href.indexOf('invite') > -1;
  }

  checkAuthUrl(): boolean {
    return window.location.href.indexOf('auth') > -1;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') ?? '';
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }
}
