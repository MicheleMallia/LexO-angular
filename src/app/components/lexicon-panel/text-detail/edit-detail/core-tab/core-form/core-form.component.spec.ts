import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreFormComponent } from './core-form.component';

describe('CoreFormComponent', () => {
  let component: CoreFormComponent;
  let fixture: ComponentFixture<CoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
