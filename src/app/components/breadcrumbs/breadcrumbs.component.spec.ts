import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterReducerState } from '@ngrx/router-store';

import * as RouterSelectors from '../../@ngrx/router/router.selectors';
import { selectSubjectByUrl } from '../../@ngrx/subjects';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { IRouterStateUrl } from '../../@ngrx';
import { Breadcrumb } from '../../common/models/breadcrumbs';
import { ISubjectSelectStore, Subject } from '../../common/models/subject';
import { RouterLinkDirectiveStub } from '../../common/testing/router-link-directive-stub';

const mockRouterState: IRouterStateUrl = {
  url: '/students/name/Unknown Unknown',
  queryParams: {},
  params: {},
  fragment: '',
};

describe('BreadcrumbsComponent', () => {
  describe('work with MockStore', () => {
    let store: MockStore;
    let fixture: ComponentFixture<BreadcrumbsComponent>;
    let mockRouterSelector: MemoizedSelector<object, RouterReducerState<IRouterStateUrl>>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BreadcrumbsComponent],
        providers: [provideMockStore()],
      });

      fixture = TestBed.createComponent(BreadcrumbsComponent);
      store = TestBed.inject(MockStore);
      mockRouterSelector = store.overrideSelector(
        RouterSelectors.selectRouter,
        {
          state: mockRouterState,
          navigationId: 0,
        },
      );

      fixture.detectChanges();
    });

    it('should set config to null by default', () => {
      expect(fixture.componentInstance.config).toBeNull();
    });

    it('should create config after first store action', () => {
      expect(fixture.componentInstance.config).toBeNull();
      mockRouterSelector.setResult({ state: mockRouterState, navigationId: 0 });
      store.refreshState();

      expect(fixture.componentInstance.config).not.toBeNull();
    });

    it('should use defaultHandler method if url did not match with handlers', () => {
      mockRouterSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();

      const config: Array<Breadcrumb> = fixture.componentInstance.config;
      expect(config).toEqual([
        new Breadcrumb({ name: 'students', path: '/students' }),
        new Breadcrumb({ name: 'name', path: '/students/name' }),
        new Breadcrumb({ name: 'Unknown Unknown', path: '/students/name/Unknown Unknown' }),
      ]);
    });

    it('should use handler which match with url', () => {
      // use subjectTableHandler in this test (common/utils/breadcrumbs/breadcrumb-handlers.ts)
      store.overrideSelector(
        selectSubjectByUrl,
        {
          subject: new Subject({ id: 1, name: 'Math' }),
        } as ISubjectSelectStore,
      );

      mockRouterSelector.setResult({
        state: {
          ...mockRouterState,
          url: '/subjects/table',
          params: { id: 1 },
        },
        navigationId: 1,
      });
      store.refreshState();

      const config: Array<Breadcrumb> = fixture.componentInstance.config;
      expect(config).toEqual([
        new Breadcrumb({ name: 'subjects', path: '/subjects' }),
        new Breadcrumb({ name: 'Math', path: '/subjects/table/1' }),
      ]);
    });
  });

  describe('create and interact with DOM elements', () => {
    let store: MockStore;
    let component: BreadcrumbsComponent;
    let fixture: ComponentFixture<BreadcrumbsComponent>;
    let mockSelector: MemoizedSelector<object, RouterReducerState<IRouterStateUrl>>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([])],
        declarations: [BreadcrumbsComponent, RouterLinkDirectiveStub],
        providers: [provideMockStore()],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(BreadcrumbsComponent);
      component = fixture.componentInstance;
      store = TestBed.inject(MockStore);
      mockSelector = store.overrideSelector(
        RouterSelectors.selectRouter,
        { state: mockRouterState, navigationId: 0 },
      );
      fixture.detectChanges();
    });

    it('should create breadcrumbs list', () => {
      mockSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();
      fixture.detectChanges();

      const list: HTMLElement = fixture.nativeElement.querySelector('.breadcrumbs__list');
      expect(list).toBeTruthy();
    });

    it('should create as many breadcrumbs link as there are in the config', () => {
      mockSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();
      fixture.detectChanges();

      const links: Array<HTMLElement> = fixture.nativeElement.querySelectorAll(
        '.breadcrumbs__link',
      );
      expect(links.length).toBe(component.config.length);
    });

    it('should pass to breadcrumbs link correct data from config', () => {
      mockSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();
      fixture.detectChanges();

      const config: Array<Breadcrumb> = component.config;
      const links: Array<DebugElement> = fixture.debugElement.queryAll(
        By.css('.breadcrumbs__link'),
      );

      links.forEach((link, index) => {
        const routerLink: RouterLinkDirectiveStub = link.injector.get(RouterLinkDirectiveStub);
        const text: string = link.nativeElement.textContent.toLowerCase().trim();

        expect(config[index].name.toLowerCase()).toBe(text);
        expect(config[index].path).toBe(routerLink.linkParams);
      });
    });

    it('should navigate to passed path after click', () => {
      mockSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();
      fixture.detectChanges();

      const config: Array<Breadcrumb> = component.config;
      const links: Array<DebugElement> = fixture.debugElement.queryAll(
        By.css('.breadcrumbs__link'),
      );

      links.forEach((link, index) => {
        const routerLink: RouterLinkDirectiveStub = link.injector.get(RouterLinkDirectiveStub);
        link.triggerEventHandler('click', {});

        expect(routerLink.navigatedTo).toBe(config[index].path);
      });
    });

    it('should add last link "breadcrumbs__link_current" class', () => {
      mockSelector.setResult({ state: mockRouterState, navigationId: 1 });
      store.refreshState();
      fixture.detectChanges();

      const link: DebugElement = fixture.debugElement.query(
        By.css('.breadcrumbs__link:last-child'),
      );

      expect(link.nativeElement.classList.contains('breadcrumbs__link_current')).toBeTrue();
    });
  });
});
