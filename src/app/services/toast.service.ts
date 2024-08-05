import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private activeComponent: string = '';

  constructor(private messageService: MessageService, private router: Router) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeComponent = event.urlAfterRedirects;
      }
    });
  }

  showToast(key: string, severity: string, summary: string, detail: string, restrictedComponents: string[] = []): void {
    if (!restrictedComponents.includes(this.activeComponent)) {
      this.messageService.add({ key, severity, summary, detail });
    }
  }

  /**
   * Show a success message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showSuccess(summary: string, detail: string, restrictedComponents: string[] = []): void {
    this.showToast('bottom-center', 'success', summary, detail, restrictedComponents);
  }

  /**
   * Show an error message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showError(summary: string, detail: string, restrictedComponents: string[] = []): void {
    this.showToast('bottom-center', 'error', summary, detail, restrictedComponents);
  }

  /**
   * Show an info message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showInfo(summary: string, detail: string, restrictedComponents: string[] = []): void {
    this.showToast('top-right', 'info', summary, detail, restrictedComponents);
  }

  
  /**
   * Show a warning message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showWarn(summary: string, detail: string, restrictedComponents: string[] = []): void {
    this.showToast('top-right', 'warn', summary, detail, restrictedComponents);
  }

 

  /**
   * Clear all messages.
   */
  clear(): void {
    this.messageService.clear();
  }
}
