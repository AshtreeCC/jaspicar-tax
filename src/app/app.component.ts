import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  logout(): void {
    this.authService.logout();
  }
}
