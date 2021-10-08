import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpidocTabComponent } from './epidoc-tab.component';

describe('EpidocTabComponent', () => {
  let component: EpidocTabComponent;
  let fixture: ComponentFixture<EpidocTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpidocTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpidocTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
