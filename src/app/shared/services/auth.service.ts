import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated$: Subject<boolean> = new Subject<boolean>();
  private authState: firebase.User;

  constructor(private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe(authState => {
      this.isAuthenticated$.next(!!authState);
      this.authState = authState;
    });
  }

  get currentUserId(): any {
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
