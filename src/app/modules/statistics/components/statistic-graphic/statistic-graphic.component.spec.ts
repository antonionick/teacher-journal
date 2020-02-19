import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticGraphicComponent } from './statistic-graphic.component';

describe('StatisticGraphicComponent', () => {
  let component: StatisticGraphicComponent;
  let fixture: ComponentFixture<StatisticGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
