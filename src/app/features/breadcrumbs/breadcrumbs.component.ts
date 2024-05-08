import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbsService, Breadcrumb } from '../../services/breadcrumbs/breadcrumbs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: string[] = [];
  private subscription: Subscription;

  constructor(private breadcrumbService: BreadcrumbsService) {}

  ngOnInit(): void {
    this.subscription = this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs.map(breadcrumb => breadcrumb.label);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
