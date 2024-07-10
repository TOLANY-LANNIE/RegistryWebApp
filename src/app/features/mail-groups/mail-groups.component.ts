import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-mail-groups',
  templateUrl: './mail-groups.component.html',
  styleUrl: './mail-groups.component.scss'
})
export class MailGroupsComponent {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  constructor(){}

  ngOnInit(){
    this.items = [
      { label: 'Email-Groups'},
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/events-board' };
  }

  applyFilter(event:Event){}
}
