import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticNavComponent } from './statistic-nav.component';

describe('StatisticNavComponent', () => {
  let component: StatisticNavComponent;
  let fixture: ComponentFixture<StatisticNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
