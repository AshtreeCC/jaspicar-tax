import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: firebase.User = null;

  constructor(private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
    });
  }

  get isAuthenticated(): boolean {
    return !!this.authState;
  }

  get currentUserId(): string {
    return this.authState.uid;
  }

  login(): Promise<auth.UserCredential> {
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.signOut();
  }
}

// Auth Guard

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login'], { queryParams: { url: state.url }});
          return false; 
        }
        return true;
      }),
    );
  }
}
