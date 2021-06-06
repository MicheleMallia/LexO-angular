import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageManagerComponent } from './language-manager.component';

describe('LanguageManagerComponent', () => {
  let component: LanguageManagerComponent;
  let fixture: ComponentFixture<LanguageManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
