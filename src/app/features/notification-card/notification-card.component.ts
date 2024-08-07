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

  avatarLabel: string;

  ngOnInit(): void {
    this.avatarLabel = this.getAvatarLabel(this.message);
  }

  onDelete() {
    this.Delete.emit();
  }

  onHide() {
    this.Hide.emit();
  }

  getAvatarLabel(message: string): string {
    if (!message) return '';
    const words = message.split(' ').slice(0, 2);
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }
}
