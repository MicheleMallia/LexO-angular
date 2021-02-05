import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecompositionTabComponent } from './decomposition-tab.component';

describe('DecompositionTabComponent', () => {
  let component: DecompositionTabComponent;
  let fixture: ComponentFixture<DecompositionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecompositionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecompositionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
