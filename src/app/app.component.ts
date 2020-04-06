import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { UpdateService } from '@shared/services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  version: string;

  constructor(
    public authService: AuthService,
    public updateService: UpdateService,
  ) { }

  ngOnInit(): void {
  }

  onLogout(): void {
    this.authService.logout();
  }

  onUpdate() {
    this.updateService.activate();
  }
}
