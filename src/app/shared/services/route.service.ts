import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
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

export class CustomReuseStrategy implements RouteReuseStrategy {

  storedRouteHandles = new Map<string, DetachedRouteHandle>();
 
  // Decides if the route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.reuseRoute === true;
  }
 
  //Store the information for the route we're destructing
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRouteHandles.set(route.routeConfig.path, handle);
  }
 
 //Return true if we have a stored route object for the next route
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRouteHandles.has(route.routeConfig.path);
  }
 
  //If we returned true in shouldAttach(), now return the actual route data for restoration
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRouteHandles.get(route.routeConfig.path);
  }
 
  //Reuse the route if we're going to and from the same route
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
