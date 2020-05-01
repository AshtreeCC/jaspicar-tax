import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './shared/services/auth.service';
import { UpdateService } from '@shared/services/update.service';
import { RouteService, StandardURL } from '@shared/services/route.service';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit  {

  version: string;
  url: StandardURL;
  years: string[];

  constructor(
    public authService: AuthService,
    public updateService: UpdateService,
    public routeService: RouteService,
    public dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // No unsubscribe necessary
    // App component lives the entire lifespan of the app
    this.dataService.years$.subscribe(data => {
      this.years = data;
      this.changeDetectorRef.markForCheck();
    })
  }

  onLogout(): void {
    this.authService.logout();
  }

  onUpdate() {
    this.updateService.activate();
  }
  
}
