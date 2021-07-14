import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtymologyFormComponent } from './etymology-form.component';

describe('EtymologyFormComponent', () => {
  let component: EtymologyFormComponent;
  let fixture: ComponentFixture<EtymologyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtymologyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtymologyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
