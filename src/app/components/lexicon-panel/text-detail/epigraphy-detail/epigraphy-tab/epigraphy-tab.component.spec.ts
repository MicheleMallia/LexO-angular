import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpigraphyTabComponent } from './epigraphy-tab.component';

describe('EpigraphyTabComponent', () => {
  let component: EpigraphyTabComponent;
  let fixture: ComponentFixture<EpigraphyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpigraphyTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpigraphyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
