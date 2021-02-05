import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynsemTabComponent } from './synsem-tab.component';

describe('SynsemTabComponent', () => {
  let component: SynsemTabComponent;
  let fixture: ComponentFixture<SynsemTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynsemTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynsemTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
