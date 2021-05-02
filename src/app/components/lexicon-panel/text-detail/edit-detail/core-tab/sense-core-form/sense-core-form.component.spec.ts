import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenseCoreFormComponent } from './sense-core-form.component';

describe('SenseCoreFormComponent', () => {
  let component: SenseCoreFormComponent;
  let fixture: ComponentFixture<SenseCoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenseCoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenseCoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
