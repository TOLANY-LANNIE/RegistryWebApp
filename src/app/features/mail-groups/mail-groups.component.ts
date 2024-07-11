import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MailGroupService } from '../../services/mail-group/mail-group.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mail-groups',
  templateUrl: './mail-groups.component.html',
  styleUrls: ['./mail-groups.component.scss'] // Corrected styleUrls
})
export class MailGroupsComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  groups: any[] = [];
  selectedGroup: any;

  constructor(
    private dialog: MatDialog,
    private groupService: MailGroupService
  ) {}

  ngOnInit() {
    this.getMailGroups();
    this.items = [
      { label: 'Email-Groups' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
  }

  applyFilter(event: Event) {}

  async getMailGroups() {
    try {
      this.groups = await this.groupService.getAll();
      this.groups.forEach((group: { id: any; }) => {
        if (!group.id) {
          console.error('Mail Group missing Id:', group); // Debugging missing Id
        }
      });
      console.log('Mail Groups:', this.groups);
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0]; // Select the first group by default
      }
    } catch (error) {
      console.error('Error fetching mail groups:', error);
    }
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
  }

  isSelected(group: any): boolean {
    return this.selectedGroup === group;
  }
}
