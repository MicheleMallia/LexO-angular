import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VartransFormComponent } from './vartrans-form.component';

describe('VartransFormComponent', () => {
  let component: VartransFormComponent;
  let fixture: ComponentFixture<VartransFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VartransFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VartransFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
