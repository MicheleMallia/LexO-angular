import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VartransTabComponent } from './vartrans-tab.component';

describe('VartransTabComponent', () => {
  let component: VartransTabComponent;
  let fixture: ComponentFixture<VartransTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VartransTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VartransTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
