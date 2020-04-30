import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { AuthService } from './shared/services/auth.service';
import { UpdateService } from '@shared/services/update.service';
import { RouteService, StandardURL } from '@shared/services/route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit  {

  version: string;
  url: StandardURL;

  constructor(
    public authService: AuthService,
    public updateService: UpdateService,
    public routeService: RouteService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.routeService.url$.subscribe(data => {
    //   [ this.page, this.year, this.view ] = data;
    //   this.page = this.page || 'tax';
    //   this.year = this.year || '2021';
    //   if (this.page =='tax' && !this.view) {
    //     this.router.navigateByUrl(`/${this.page}/${this.year}/income`);
    //   }
    //   this.changeDetectorRef.markForCheck();
    // });

    // this.routeService.url$.subscribe(
    //   success => console.log('app success', success),
    //   error => console.log('app error', error),
    // );

    // this.url = this.routeService.getURL();
    
  }

  onLogout(): void {
    this.authService.logout();
  }

  onUpdate() {
    this.updateService.activate();
  }
  
}
