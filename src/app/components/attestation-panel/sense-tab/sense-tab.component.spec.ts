import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenseTabComponent } from './sense-tab.component';

describe('SenseTabComponent', () => {
  let component: SenseTabComponent;
  let fixture: ComponentFixture<SenseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenseTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
