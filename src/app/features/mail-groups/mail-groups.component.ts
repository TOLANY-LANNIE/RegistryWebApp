import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MailGroupService } from '../../services/mail-group/mail-group.service';
import { RecipientsService } from '../../services/recipients/recipients.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import { Sort, MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { AddGroupComponent } from '../../modals/add-group/add-group.component';
import { AddRecipientComponent } from '../../modals/add-recipient/add-recipient.component';
import { DeleteRecipientComponent } from '../../modals/delete-recipient/delete-recipient.component';


@Component({
  selector: 'app-mail-groups',
  templateUrl: './mail-groups.component.html',
  styleUrls: ['./mail-groups.component.scss'] // Corrected styleUrls
})
export class MailGroupsComponent implements AfterViewInit{
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  groups: any[] = [];
  recipients: any[] = [];
  selectedGroup: any;
  displayedColumns = ['Avartar','Name','Surname','Email','MoreOptions'];
  dataSource: MatTableDataSource<any>= new MatTableDataSource<any>();
  searchString = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private groupService: MailGroupService,
    private recipientsService: RecipientsService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get filteredGroups() {
    return this.groups.filter(group =>
      group.Name.toLowerCase().includes(this.searchString.toLowerCase())
    );
  }
  ngOnInit() {
    this.getMailGroups();
    this.items = [
      { label: 'Email-Groups' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
  }

  async getMailGroups() {
    try {
      this.groups = await this.groupService.getAll();
      this.groups.forEach((group: { id: any; }) => {
        if (!group.id) {
          //console.error('Mail Group missing Id:', group); // Debugging missing Id
        }
      });
      //console.log('Mail Groups:', this.groups);
      if (this.groups.length > 0) {
        this.selectGroup( this.groups[0]); // Select the first group by default
      }
    } catch (error) {
      console.error('Error fetching mail groups:', error);
    }
  }

  async getRecipients(group:any) {
    try {
      this.recipients = await this.recipientsService.getRecipient(group.id);
      this.dataSource = new MatTableDataSource(this.recipients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error fetching mail groups:', error);
    }
  }

  selectGroup(group:any) {
    this.selectedGroup = group;
    this.getRecipients(group)
  }

  isSelected(group: any): boolean {
    return this.selectedGroup === group;
  }

  /**
   * Create the Recipients Initials
   */
  getInitials(name: string, surname: string): string {
    const firstNameInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastNameInitial = surname ? surname.charAt(0).toUpperCase() : '';
    return `${firstNameInitial}${lastNameInitial}`;
  }

  /**
   * Open the Add Group Dialog
   */
  openAddGroupModal() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      data: {},
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getMailGroups(); // Refresh events data after adding a new group
    });
  }

  /**
   * Open the Add Recipient Dialog
   */
  openAddRecipientModal() {
    const dialogRef = this.dialog.open(AddRecipientComponent, {
      data:this.selectedGroup,
      disableClose: true,
      panelClass: 'fullscreen-dialog',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRecipients(this.selectedGroup); // Refresh events data after adding a new group
    });
  }
  /**
   * Delete recipient from the group
   * @param event 
   */
  openDeleteRecipient(recipient: any) {
    const dialogRef = this.dialog.open(DeleteRecipientComponent, {
      data: recipient,
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getRecipients(this.selectedGroup);
    });
  }
}
