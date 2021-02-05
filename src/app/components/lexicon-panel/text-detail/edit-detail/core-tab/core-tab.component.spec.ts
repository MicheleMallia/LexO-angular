import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreTabComponent } from './core-tab.component';

describe('CoreTabComponent', () => {
  let component: CoreTabComponent;
  let fixture: ComponentFixture<CoreTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
