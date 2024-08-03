import { Component, Input, Output } from '@angular/core';
import { EventEmitter} from '@angular/core'
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  @Input() message: string;
  @Input() date: string;

  // Add an Output event emitter for delete action
  @Output() delete = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }
}
