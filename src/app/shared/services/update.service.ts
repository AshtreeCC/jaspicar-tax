import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  version: string = '0.1.7';
  available$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private swUpdate: SwUpdate,
    public snackBar: MatSnackBar,
  ) { 
    if (this.swUpdate.isEnabled) {
      // Notify the user when an update is available
      this.swUpdate.available.subscribe(event => {
        this.available$.next(true);
      });

      // Reload the app when an update has been activated
      this.swUpdate.activated.subscribe(() => {
        this.available$.next(false);
        document.location.reload();
      });

      // Check for updates periodically
      // 10 min * 60 seconds * 1000 milliseconds
      setInterval(() => this.swUpdate.checkForUpdate(), 600000);
    }
  }

  activate(): void {
    this.swUpdate.activateUpdate();
  }
}
