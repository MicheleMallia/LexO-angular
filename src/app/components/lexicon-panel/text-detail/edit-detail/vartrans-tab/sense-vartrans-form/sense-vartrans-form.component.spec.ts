import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenseVartransFormComponent } from './sense-vartrans-form.component';

describe('SenseVartransFormComponent', () => {
  let component: SenseVartransFormComponent;
  let fixture: ComponentFixture<SenseVartransFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenseVartransFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenseVartransFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
