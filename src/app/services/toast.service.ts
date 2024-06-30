import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  /**
   * Show a success message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showSuccess(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  /**
   * Show an error message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showError(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  /**
   * Show an info message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showInfo(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  /**
   * Show a warning message.
   * @param summary Summary of the message.
   * @param detail Detail of the message.
   */
  showWarning(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  /**
   * Clear all messages.
   */
  clear(): void {
    this.messageService.clear();
  }
}
