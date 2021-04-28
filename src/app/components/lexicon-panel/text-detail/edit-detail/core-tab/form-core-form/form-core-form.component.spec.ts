import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCoreFormComponent } from './form-core-form.component';

describe('FormCoreFormComponent', () => {
  let component: FormCoreFormComponent;
  let fixture: ComponentFixture<FormCoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
