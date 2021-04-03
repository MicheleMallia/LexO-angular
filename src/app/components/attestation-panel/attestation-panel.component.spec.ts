import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationPanelComponent } from './attestation-panel.component';

describe('AttestationPanelComponent', () => {
  let component: AttestationPanelComponent;
  let fixture: ComponentFixture<AttestationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttestationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
