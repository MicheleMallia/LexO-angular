import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpigraphyDetailComponent } from './epigraphy-detail.component';

describe('EpigraphyDetailComponent', () => {
  let component: EpigraphyDetailComponent;
  let fixture: ComponentFixture<EpigraphyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpigraphyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpigraphyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
