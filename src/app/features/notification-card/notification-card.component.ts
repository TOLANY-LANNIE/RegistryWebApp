import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {
  @Input() message: string;
  @Input() date: string;
  @Input() read: boolean;
  @Output() Hide = new EventEmitter<void>();
  @Output() Delete = new EventEmitter<void>();

  onDelete() {
    this.Delete.emit();
  }


  onHide() {
    this.Hide.emit();
  }
}
