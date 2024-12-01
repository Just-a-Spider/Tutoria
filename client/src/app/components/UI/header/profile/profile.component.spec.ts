import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangeButton } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileChangeButton;
  let fixture: ComponentFixture<ProfileChangeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileChangeButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileChangeButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
