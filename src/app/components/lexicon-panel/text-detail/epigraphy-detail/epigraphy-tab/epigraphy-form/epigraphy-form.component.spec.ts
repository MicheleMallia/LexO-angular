import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpigraphyFormComponent } from './epigraphy-form.component';

describe('EpigraphyFormComponent', () => {
  let component: EpigraphyFormComponent;
  let fixture: ComponentFixture<EpigraphyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpigraphyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpigraphyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
