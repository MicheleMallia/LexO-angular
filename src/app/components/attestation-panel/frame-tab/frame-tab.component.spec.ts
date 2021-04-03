import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameTabComponent } from './frame-tab.component';

describe('FrameTabComponent', () => {
  let component: FrameTabComponent;
  let fixture: ComponentFixture<FrameTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
