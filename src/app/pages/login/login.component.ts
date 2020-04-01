import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;

  private returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  // Get return url from route parameters or default to the user profile
    this.returnUrl = this.route.snapshot.queryParams['url'] || '';
  }

  async loginWithGoogle() {
    this.loading = true;
    const result = await this.authService.login();
    if (result) {
      this.router.navigateByUrl(this.returnUrl);
      this.loading = false;
    }
  }

}
