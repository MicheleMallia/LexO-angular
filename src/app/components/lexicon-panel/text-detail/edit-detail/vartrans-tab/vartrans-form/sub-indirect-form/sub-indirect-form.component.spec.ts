import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIndirectFormComponent } from './sub-indirect-form.component';

describe('SubIndirectFormComponent', () => {
  let component: SubIndirectFormComponent;
  let fixture: ComponentFixture<SubIndirectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubIndirectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIndirectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
