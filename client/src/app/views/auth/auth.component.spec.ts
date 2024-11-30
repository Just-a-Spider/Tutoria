import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthView } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthView;
  let fixture: ComponentFixture<AuthView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthView],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
