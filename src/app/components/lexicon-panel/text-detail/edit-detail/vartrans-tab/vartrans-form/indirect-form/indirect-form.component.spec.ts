import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirectFormComponent } from './indirect-form.component';

describe('IndirectFormComponent', () => {
  let component: IndirectFormComponent;
  let fixture: ComponentFixture<IndirectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndirectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndirectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
