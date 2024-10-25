import { Component, signal, Input, computed } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

export type MenuItem ={
  icon:string;
  label:string;
  route?: string;

}
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
 
  
  constructor(
    private authService: AuthService,
    private router: Router
  ){}
 /**
 * The following code defines a component class with properties and methods related to a collapsible sidenav.
 * It uses MobX signals to manage the state of the sidenavCollapsed property.
 */

  // Create a signal for managing the sidenav collapsed state
  sidenavCollapsed = signal(false)


  /**
  * Input property decorator to handle changes in the 'collapsed' input property.
  * When the 'collapsed' input changes, it updates the 'sidenavCollapsed' signal.
  * @param val - The new value of the 'collapsed' property.
  */
  @Input () set collapsed(val:boolean){
    this.sidenavCollapsed.set(val);
  };

  /**
  * A signal representing an array of menu items.
  * Each menu item has properties such as icon, label, and route.
  * Used to define the menu structure for the component.
  */
  menuItems = signal<MenuItem[]>([
    {
      icon:'dashboard',
      label:'Dashboard',
      route:'events-board'
    },
    {
      icon:'event',
      label:'Calendar',
      route:'calendar'
    },
    {
      icon:'event_available',
      label:'Events List',
      route:'events'
    },
    {
      icon:'group',
      label:'Email Groups',
      route:'groups'
    },
    {
      icon:'exit_to_app',
      label:'Logout',
      route:'auth/login'
    },
  ]);

  profilePicSize = computed(()=>this.sidenavCollapsed()?'32':'100')

   // Logout method to handle the logout action
   logout() {
      // You can also navigate to the login page after logout if needed
      sessionStorage.removeItem('user');
      this.authService.logout();
      this.router.navigate(['/auth/login']);
  }
}
