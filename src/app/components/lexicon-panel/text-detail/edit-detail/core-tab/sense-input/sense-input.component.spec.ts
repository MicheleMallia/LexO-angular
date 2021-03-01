import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenseInputComponent } from './sense-input.component';

describe('SenseInputComponent', () => {
  let component: SenseInputComponent;
  let fixture: ComponentFixture<SenseInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenseInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
