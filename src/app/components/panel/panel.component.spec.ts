import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { PanelComponent } from './panel.component';
import { RouterLinkDirectiveStub } from '../../common/testing/router-link-directive-stub';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let debugElements: Array<DebugElement>;
  let directives: Array<RouterLinkDirectiveStub>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        PanelComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [TranslateService],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    debugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    directives = debugElements.map((directive) => (
      directive.injector.get(RouterLinkDirectiveStub)
    ));
  });

  it('should get RouterLinks from template', () => {
    fixture.detectChanges();

    expect(directives.length).toBe(4);
    expect(directives[0].linkParams).toEqual(['/students']);
    expect(directives[1].linkParams).toEqual(['/subjects']);
    expect(directives[2].linkParams).toEqual(['/statistics']);
    expect(directives[3].linkParams).toEqual(['/export']);
  });

  it('should navigate to Students after click students link', () => {
    fixture.detectChanges();
    const studentLinkDe: DebugElement = debugElements[0];
    const studentLink: RouterLinkDirectiveStub = directives[0];

    expect(studentLink.navigatedTo).toBeNull();
    studentLinkDe.triggerEventHandler('click', {});

    expect(studentLink.navigatedTo).toEqual(studentLink.linkParams);
  });

  it('should navigate to Subjects after click subjects link', () => {
    const subjectLinkDe: DebugElement = debugElements[1];
    const subjectLink: RouterLinkDirectiveStub = directives[1];

    expect(subjectLink.navigatedTo).toBeNull();
    subjectLinkDe.triggerEventHandler('click', {});

    expect(subjectLink.navigatedTo).toEqual(subjectLink.linkParams);
  });

  it('should navigate to Statistics after click statistics link', () => {
    const statisticsLinkDe: DebugElement = debugElements[2];
    const statisticsLink: RouterLinkDirectiveStub = directives[2];

    expect(statisticsLink.navigatedTo).toBeNull();
    statisticsLinkDe.triggerEventHandler('click', {});

    expect(statisticsLink.navigatedTo).toEqual(statisticsLink.linkParams);
  });

  it('should navigate to Export after click export link', () => {
    const exportLinkDe: DebugElement = debugElements[3];
    const exportLink: RouterLinkDirectiveStub = directives[3];

    expect(exportLink.navigatedTo).toBeNull();
    exportLinkDe.triggerEventHandler('click', {});

    expect(exportLink.navigatedTo).toEqual(exportLink.linkParams);
  });
});
