import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostForm } from './create.component';

describe('CreateComponent', () => {
  let component: CreatePostForm;
  let fixture: ComponentFixture<CreatePostForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePostForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
