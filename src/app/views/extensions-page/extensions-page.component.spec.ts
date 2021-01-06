import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionsPageComponent } from './extensions-page.component';

describe('ExtensionsPageComponent', () => {
  let component: ExtensionsPageComponent;
  let fixture: ComponentFixture<ExtensionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtensionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
