import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { ActivatedRoute, UrlSegment } from '@angular/router';

import { filter, map, delay, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Location } from '@angular/common';

export interface StandardURL {
  page: string,
  year: string,
  view: string,
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  url$: Subject<StandardURL> = new BehaviorSubject<StandardURL>(this.getCurrentURL());

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private location: Location,
  ) { 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.url.split('/')),
      map((url: string[]) => { 
        return { 
          page: url[1] || 'tax',
          year: url[2] || new Date().getFullYear(),
          view: url[3],
        } as StandardURL;
      }),
      tap((url: StandardURL) => {
        if (Number.isNaN(Number(url.year))) {
          const view = (url.view) ? `/${url.view}` : '';
          this.router.navigateByUrl(`/${url.page}/${new Date().getFullYear()}${view}`);
        } else if (url.page =='tax' && !url.view) {
          this.router.navigateByUrl(`/${url.page}/${url.year}/income`);
        } else {
          this.url$.next(url);
        }
      }),
      // Using SetTimeout as a fix
      // Accordion content not loaded without it
      // delay(300),
      // tap(console.log),
    ).subscribe();
  }

  getCurrentURL(): StandardURL {
    // const url = this.route.snapshot.url.map((url: UrlSegment) => url.path);
    const url = this.location.path().split('/');
    return { 
      page: url[1],
      year: url[2],
      view: url[3],
    }
  }

}
