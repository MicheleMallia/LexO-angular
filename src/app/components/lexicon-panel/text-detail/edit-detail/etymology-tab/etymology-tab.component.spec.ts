import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtymologyTabComponent } from './etymology-tab.component';

describe('EtymologyTabComponent', () => {
  let component: EtymologyTabComponent;
  let fixture: ComponentFixture<EtymologyTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtymologyTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtymologyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
