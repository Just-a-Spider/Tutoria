import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingView } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingView;
  let fixture: ComponentFixture<LandingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingView],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
