import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';

import { SubjectFormComponent } from './index';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<SubjectFormComponent> {
  public canDeactivate(
    component: SubjectFormComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.showSaveQuestion();
  }

}
